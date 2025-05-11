import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Album.module.scss";
import Button from "@/components/Button/Button";
import Loader from "@/components/Layout/Loader/Loader";
import IconComponent from "@/components/Asset/Icon";
import { createAlbums } from "@/api/albums/createAlbums";
import { patchAlbums } from "@/api/albums/patchAlbums";
import { deleteAlbums } from "@/api/albums/deleteAlbums";
import { putAlbumsOrder } from "@/api/albums/putAlbumsOrder";
import { useMyAlbums } from "@/api/me/getMyAlbums";
import { useToast } from "@/hooks/useToast";
import { useDeviceStore } from "@/states/deviceStore";
import { useModalStore } from "@/states/modalStore";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import router from "next/router";

export default function Album() {
  const { data, isLoading, isError, refetch } = useMyAlbums();
  const closeModal = useModalStore((state) => state.closeModal);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { showToast } = useToast();
  const albumsRef = useRef<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [editingAlbums, setEditingAlbums] = useState<any[]>([]);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [isEditingAlbumName, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const debounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    albumsRef.current = albums;
  }, [albums]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setAlbums(data);
      setEditingAlbums(data);

      const initialInputValues = data.reduce((acc, album) => {
        acc[album.id] = album.name;
        return acc;
      }, {} as { [key: string]: string });
      setInputValues(initialInputValues);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // 앨범 추가
  const handleCreateAlbum = async () => {
    if (name.trim() === "" || name.trim().length < 1) {
      setError("앨범명은 비워둘 수 없습니다.");
      return;
    }
    if (albums.length >= 8) {
      setError("최대 8개의 앨범을 만들 수 있어요.");
      return;
    }
    try {
      await createAlbums({ name });
      refetch();
    } catch (err: any) {
      if (err?.message === "앨범 이름 중복") {
        setError("중복된 이름은 사용하실 수 없어요");
      } else {
        showToast("앨범 추가에 실패했습니다.", "error");
      }
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(editingAlbums);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setEditingAlbums(reordered);
  };

  const toggleEditingOrder = async () => {
    if (isEditingOrder) {
      const originalIds = albums.map((a) => a.id).join();
      const newIds = editingAlbums.map((a) => a.id).join();

      if (originalIds !== newIds) {
        try {
          const ids = editingAlbums.map((album) => album.id);
          await putAlbumsOrder({ ids });
          showToast("앨범 순서가 변경되었습니다!", "success");
          setAlbums(editingAlbums);
          refetch();
          closeModal();
          router.reload();
        } catch (err) {
          showToast("앨범 순서 변경에 실패했습니다.", "error");
          setEditingAlbums(albums);
        }
      }
    } else {
      setEditingAlbums([...albums]);
    }
    setIsEditingOrder(!isEditingOrder);
  };

  const updateAlbumName = useCallback(
    async (id: string, newName: string) => {
      setIsEditing((prev) => ({ ...prev, [id]: true }));

      try {
        await patchAlbums(id, { name: newName });
        setAlbums((prevAlbums) =>
          prevAlbums.map((album) => (album.id === id ? { ...album, name: newName } : album)),
        );
        refetch();
      } catch (err: any) {
        showToast(
          err?.message === "앨범 이름 중복"
            ? "중복된 이름은 사용하실 수 없어요"
            : "앨범 이름 변경에 실패했습니다.",
          "error",
        );

        const originalAlbum = albumsRef.current.find((a) => a.id === id);
        if (originalAlbum) {
          setInputValues((prev) => ({ ...prev, [id]: originalAlbum.name }));
        }
      } finally {
        setIsEditing((prev) => ({ ...prev, [id]: false }));
      }
    },
    [showToast, refetch],
  );

  const handleInputChange = useCallback(
    (id: string, value: string) => {
      if (debounceTimers.current[id]) {
        clearTimeout(debounceTimers.current[id]);
      }
      setInputValues((prev) => ({ ...prev, [id]: value }));
      debounceTimers.current[id] = setTimeout(() => {
        const trimmedValue = value.trim();

        if (!trimmedValue) {
          showToast("앨범명은 비워둘 수 없습니다.", "error");
          const originalAlbum = albumsRef.current.find((a) => a.id === id);
          if (originalAlbum) {
            setInputValues((prev) => ({ ...prev, [id]: originalAlbum.name }));
          }
          return;
        }

        const originalAlbum = albumsRef.current.find((a) => a.id === id);
        if (originalAlbum && trimmedValue !== originalAlbum.name) {
          updateAlbumName(id, trimmedValue);
        }
      }, 1000); // 디바운싱 딜레이
    },
    [showToast, updateAlbumName],
  );

  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach((timer) => clearTimeout(timer));
      closeModal();
    };
  }, [closeModal]);

  const handleDeleteAlbum = async (id: string) => {
    try {
      await deleteAlbums(id);
      showToast("앨범이 삭제되었습니다.", "success");
      setAlbums((prev) => prev.filter((album) => album.id !== id));
      setEditingAlbums((prev) => prev.filter((album) => album.id !== id));
      setInputValues((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      refetch();
      closeModal();
      router.reload();
    } catch (err: any) {
      showToast("앨범 삭제 실패", "error");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      {!isMobile && (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>앨범 편집</h2>
        </div>
      )}

      <div className={styles.textBtnContainer}>
        <div>
          <div className={styles.addAlbumContainer}>
            <p className={styles.titleText}>새 앨범 추가</p>
            <div className={styles.inputArea}>
              <div className={`${styles.inputWrapper} ${error ? styles.error : ""}`}>
                <input
                  id="name"
                  className={styles.inputField}
                  placeholder="예시 : '크로키' 또는 '일러스트'"
                  value={name}
                  onChange={(e) => {
                    setError("");
                    setName(e.target.value);
                  }}
                  maxLength={15}
                />
                {name && (
                  <div className={styles.countTotal}>
                    <p className={styles.count}>{name.length}</p>/15
                  </div>
                )}
                {error && <p className={styles.errorMessage}>{error}</p>}
              </div>
              <div className={styles.btn}>
                <Button
                  onClick={handleCreateAlbum}
                  type="filled-primary"
                  size={isMobile ? "m" : "l"}
                  disabled={!!error}
                >
                  추가
                </Button>
              </div>
            </div>
          </div>

          <div className={styles.editAlbumContainer}>
            <div className={styles.editBar}>
              <p className={styles.titleText}>앨범 목록</p>
              <p
                className={`${styles.editOrderBtn} ${isEditingOrder ? styles.completeBtn : ""}`}
                onClick={toggleEditingOrder}
              >
                {isEditingOrder ? "완료" : "순서 편집"}
              </p>
            </div>

            {isError && (
              <div className={styles.errorMessage}>앨범 목록을 불러오는데 실패했습니다.</div>
            )}

            {albums.length === 0 && !isError && !isLoading ? (
              <p className={styles.emptyText}>생성된 앨범이 없어요.</p>
            ) : (
              <div>
                {!isEditingOrder ? (
                  <div className={styles.albumList}>
                    {albums.map((album) => (
                      <div key={album.id} className={styles.albumsContainer}>
                        <input
                          type="text"
                          value={inputValues[album.id] ?? album.name ?? ""}
                          className={styles.albumItem}
                          onChange={(e) => handleInputChange(album.id, e.target.value)}
                          disabled={false}
                          style={isEditingAlbumName[album.id] ? { opacity: 0.5 } : undefined}
                          maxLength={15}
                        />
                        <div className={styles.removeAlbumButton}>
                          <div onClick={() => handleDeleteAlbum(album.id)}>
                            <IconComponent name="deleteAlbum" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="albumList" direction="vertical">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={styles.albumList}
                        >
                          {editingAlbums.map((album, index) => (
                            <Draggable key={album.id} draggableId={album.id} index={index}>
                              {(provided) => (
                                <div
                                  className={styles.albumsContainer}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
                                  <input
                                    type="text"
                                    value={album.name || ""}
                                    disabled={true}
                                    className={styles.albumItem}
                                  />
                                  <div
                                    className={styles.removeAlbumButton}
                                    {...provided.dragHandleProps}
                                  >
                                    <IconComponent name="editOrder" />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

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

  const handleCreateAlbum = async () => {
    if (!name.trim()) {
      setError("앨범명은 비워둘 수 없습니다.");
      return;
    }
    if (albums.some((a) => a.name === name.trim())) {
      setError("중복된 이름은 사용하실 수 없어요");
      return;
    }
    if (albums.length >= 8) {
      setError("최대 8개의 앨범을 만들 수 있어요.");
      return;
    }
    try {
      await createAlbums({ name: name.trim() });
      setName("");
      refetch();
    } catch (err: any) {
      showToast("앨범 추가에 실패했습니다.", "error");
    }
  };

  const handleRename = async (id: string) => {
    const newName = inputValues[id]?.trim();
    if (!newName) return;
    if (albums.some((a) => a.name === newName && a.id !== id)) {
      showToast("중복된 이름은 사용하실 수 없어요", "warning");
      return;
    }
    try {
      await patchAlbums(id, { name: newName });
      setAlbums((prev) => prev.map((a) => (a.id === id ? { ...a, name: newName } : a)));
      setEditingId(null);
      refetch();
    } catch {
      showToast("앨범명 변경에 실패했습니다.", "error");
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
      const ids = editingAlbums.map((a) => a.id);
      if (ids.join() !== albums.map((a) => a.id).join()) {
        try {
          await putAlbumsOrder({ ids });
          showToast("앨범 순서가 변경되었습니다!", "success");
          setAlbums(editingAlbums);
          refetch();
          closeModal();
          router.reload();
        } catch {
          showToast("앨범 순서 변경에 실패했습니다.", "error");
        }
      }
    } else {
      setEditingAlbums([...albums]);
    }
    setIsEditingOrder(!isEditingOrder);
  };

  const handleDeleteAlbum = async (id: string) => {
    try {
      await deleteAlbums(id);
      showToast("앨범이 삭제되었습니다.", "success");
      refetch();
    } catch {
      showToast("앨범 삭제에 실패했습니다.", "error");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      {!isMobile && (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>앨범 편집</h2>
        </div>
      )}

      <div className={styles.textBtnContainer}>
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
            {albums.length > 1 && (
              <p
                className={`${styles.editOrderBtn} ${isEditingOrder ? styles.completeBtn : ""}`}
                onClick={toggleEditingOrder}
              >
                {isEditingOrder ? "완료" : "순서 편집"}
              </p>
            )}
          </div>

          {isError && (
            <div className={styles.errorMessage}>앨범 목록을 불러오는데 실패했습니다.</div>
          )}

          {albums.length === 0 && !isError && !isLoading ? (
            <p className={styles.emptyText}>생성된 앨범이 없어요.</p>
          ) : (
            <div className={styles.albumListWrapper}>
              {!isEditingOrder ? (
                <div className={styles.albumList}>
                  {albums.map((album) => {
                    const isEditing = editingId === album.id;
                    return (
                      <div key={album.id} className={styles.albumsContainer}>
                        <div className={styles.inputWrapper}>
                          <input
                            type="text"
                            value={inputValues[album.id] ?? ""}
                            className={styles.albumItem}
                            disabled={editingId !== album.id}
                            onChange={(e) =>
                              setInputValues((prev) => ({
                                ...prev,
                                [album.id]: e.target.value,
                              }))
                            }
                            maxLength={15}
                          />

                          {!isEditing ? (
                            <div
                              className={styles.iconInsideInput}
                              onClick={() => setEditingId(album.id)}
                            >
                              수정
                            </div>
                          ) : (
                            <div className={styles.actionGroup}>
                              <div
                                className={styles.cancleBtn}
                                onClick={() => {
                                  setInputValues((prev) => ({
                                    ...prev,
                                    [album.id]: album.name,
                                  }));
                                  setEditingId(null);
                                }}
                              >
                                취소
                              </div>
                              <div
                                className={styles.completeBtn}
                                onClick={() => handleRename(album.id)}
                              >
                                완료
                              </div>
                            </div>
                          )}
                        </div>

                        {!isEditing && (
                          <div
                            className={styles.removeAlbumButton}
                            onClick={() => handleDeleteAlbum(album.id)}
                          >
                            <IconComponent name="deleteAlbum" size={24} />
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                                {...provided.dragHandleProps}
                              >
                                <div className={styles.inputWrapper}>
                                  <input
                                    type="text"
                                    value={album.name || ""}
                                    disabled={true}
                                    className={styles.albumItem}
                                  />
                                </div>
                                <div className={styles.removeAlbumButton}>
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
  );
}

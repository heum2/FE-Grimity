export interface PostFormProps {
  formTitle: string;
  title: string;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  content: string;
  onEditorChange: (value: string) => void;
  selectedCategory: string;
  onCategoryClick: (category: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitButtonText: string;
}

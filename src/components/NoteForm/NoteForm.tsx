import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import type { CreateNoteParams } from "../../services/noteService";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (note: CreateNoteParams) => void;
  onCancel: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Мінімум 3 символи")
    .max(50, "Максимум 50 символів")
    .required("Обов'язкове поле"),
  content: Yup.string().max(500, "Максимум 500 символів"),
  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Некоректний тег",
    )
    .required("Обов'язкове поле"),
});

const initialValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  const handleSubmit = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    onSubmit({
      title: values.title,
      content: values.content,
      tags: [values.tag],
    });
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            {/* Обходимо обмеження TypeScript для атрибута name через приведення типів */}
            {touched.title && errors.title ? (
              <span
                className={css.error}
                {...({
                  name: "title",
                } as React.HTMLAttributes<HTMLSpanElement> & { name: string })}
              >
                {String(errors.title)}
              </span>
            ) : (
              <span
                className={css.error}
                {...({
                  name: "title",
                } as React.HTMLAttributes<HTMLSpanElement> & { name: string })}
              />
            )}
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            {touched.content && errors.content ? (
              <span
                className={css.error}
                {...({
                  name: "content",
                } as React.HTMLAttributes<HTMLSpanElement> & { name: string })}
              >
                {String(errors.content)}
              </span>
            ) : (
              <span
                className={css.error}
                {...({
                  name: "content",
                } as React.HTMLAttributes<HTMLSpanElement> & { name: string })}
              />
            )}
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            {touched.tag && errors.tag ? (
              <span
                className={css.error}
                {...({
                  name: "tag",
                } as React.HTMLAttributes<HTMLSpanElement> & { name: string })}
              >
                {String(errors.tag)}
              </span>
            ) : (
              <span
                className={css.error}
                {...({
                  name: "tag",
                } as React.HTMLAttributes<HTMLSpanElement> & { name: string })}
              />
            )}
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

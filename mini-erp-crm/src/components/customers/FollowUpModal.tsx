import {
    useState,
  } from "react";
  
  import Modal from "../ui/Modal";
  import Button from "../ui/Button";
  import TextAreaField from "../ui/TextAreaField";
  
  interface FollowUpModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (
      note: string,
      date: string,
    ) => void;
  }
  
  export default function FollowUpModal({
    open,
    onClose,
    onSubmit,
  }: FollowUpModalProps) {
    const [note, setNote] =
      useState("");
  
    const [date, setDate] =
      useState("");
  
    const handleSubmit = (
      event: React.FormEvent,
    ) => {
      event.preventDefault();
  
      if (!note.trim() || !date) {
        return;
      }
  
      onSubmit(note.trim(), date);
  
      setNote("");
      setDate("");
    };
  
    return (
      <Modal
        open={open}
        onClose={onClose}
        title="Add Follow-up"
        description="Record the next customer interaction."
        size="md"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <TextAreaField
            id="followup-note"
            label="Follow-up Note"
            placeholder="What was discussed with the customer?"
            value={note}
            onChange={(event) =>
              setNote(event.target.value)
            }
            required
          />
  
          <div>
            <label
              htmlFor="followup-date"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Follow-up Date
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>
  
            <div className="rounded-xl border border-slate-200 px-3.5 py-2.5">
              <input
                id="followup-date"
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="block w-full border-0 bg-transparent p-0 text-sm text-slate-800 outline-none"
                required
              />
            </div>
          </div>
  
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
  
            <Button type="submit">
              Save Follow-up
            </Button>
          </div>
        </form>
      </Modal>
    );
  }
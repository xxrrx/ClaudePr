"use client";

import { ChangeEvent, FormEvent, KeyboardEvent, useRef, useState, useEffect } from "react";
import { Send } from "lucide-react";
import { useFileSystem } from "@/lib/contexts/file-system-context";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function MessageInput({
  input,
  setInput,
  handleInputChange,
  handleSubmit,
  isLoading,
}: MessageInputProps) {
  const { getAllFiles } = useFileSystem();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [query, setQuery] = useState("");
  const [hashIndex, setHashIndex] = useState(-1);
  const [activeIndex, setActiveIndex] = useState(0);

  const allFiles = Array.from(getAllFiles().keys()).sort();
  const filtered = query
    ? allFiles.filter((f) => f.toLowerCase().includes(query.toLowerCase()))
    : allFiles;

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const closePicker = () => {
    setShowPicker(false);
    setQuery("");
    setHashIndex(-1);
  };

  const selectFile = (filePath: string) => {
    if (hashIndex === -1) return;
    const before = input.slice(0, hashIndex);
    const after = input.slice(textareaRef.current?.selectionStart ?? hashIndex + 1 + query.length);
    const newValue = before + "#" + filePath + " " + after;
    setInput(newValue);
    closePicker();
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    const value = e.target.value;
    const cursor = e.target.selectionStart;

    // Find the last # before cursor
    const textBeforeCursor = value.slice(0, cursor);
    const lastHash = textBeforeCursor.lastIndexOf("#");

    if (lastHash !== -1) {
      const textAfterHash = textBeforeCursor.slice(lastHash + 1);
      // Show picker if no space after # (still typing)
      if (!textAfterHash.includes(" ")) {
        setHashIndex(lastHash);
        setQuery(textAfterHash);
        setShowPicker(true);
        return;
      }
    }
    closePicker();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showPicker && filtered.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        selectFile(filtered[activeIndex]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closePicker();
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative p-4 bg-white border-t border-neutral-200/60">
      <div className="relative max-w-4xl mx-auto">
        {showPicker && (
          <div className="absolute bottom-full mb-1 left-0 w-full max-h-48 overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-lg z-50">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-neutral-400 italic">
                {allFiles.length === 0
                  ? "No files yet — generate a component first"
                  : "No files match"}
              </p>
            ) : (
              filtered.map((file, i) => (
                <button
                  key={file}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectFile(file);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm font-mono truncate transition-colors ${
                    i === activeIndex
                      ? "bg-blue-50 text-blue-700"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {file}
                </button>
              ))
            )}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(closePicker, 150)}
          placeholder="Describe the React component you want to create... (type # to reference a file)"
          disabled={isLoading}
          className="w-full min-h-[80px] max-h-[200px] pl-4 pr-14 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 focus:bg-white transition-all placeholder:text-neutral-400 text-[15px] font-normal shadow-sm"
          rows={3}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-3 bottom-3 p-2.5 rounded-lg transition-all hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent group"
        >
          <Send className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isLoading || !input.trim() ? "text-neutral-300" : "text-blue-600"}`} />
        </button>
      </div>
    </form>
  );
}

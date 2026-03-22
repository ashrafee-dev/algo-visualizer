import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback, useEffect, useRef } from "react";

interface PythonMonacoProps {
  value: string;
  readOnly: boolean;
  highlightLine: number | null | undefined;
  onChange: (v: string) => void;
}

export function PythonMonaco({ value, readOnly, highlightLine, onChange }: PythonMonacoProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationIdsRef = useRef<string[]>([]);

  const onMount = useCallback((ed: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = ed;
    monacoRef.current = monaco;
  }, []);

  useEffect(() => {
    const ed = editorRef.current;
    const monaco = monacoRef.current;
    if (!ed || !monaco) return;
    const model = ed.getModel();
    if (!model) return;
    const line = highlightLine;
    const next =
      line != null && line >= 1 && line <= model.getLineCount()
        ? [
            {
              range: new monaco.Range(line, 1, line, model.getLineMaxColumn(line)),
              options: {
                isWholeLine: true,
                className: "monaco-active-step-line",
              },
            },
          ]
        : [];
    decorationIdsRef.current = ed.deltaDecorations(decorationIdsRef.current, next);
    if (line != null && line >= 1 && line <= model.getLineCount()) {
      ed.revealLineInCenter(line, 0 /* Smooth */);
    }
  }, [highlightLine, value]);

  return (
    <Editor
      height="100%"
      language="python"
      theme="vs-dark"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      onMount={onMount}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: "JetBrains Mono, ui-monospace, monospace",
        padding: { top: 8, bottom: 0 },
        scrollBeyondLastLine: false,
        scrollbar: { vertical: "hidden", horizontal: "auto" },
        smoothScrolling: true,
        renderLineHighlight: "line",
      }}
    />
  );
}

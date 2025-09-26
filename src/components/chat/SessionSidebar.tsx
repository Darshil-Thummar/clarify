import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSessions, deleteSessionById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SessionSidebarProps {
  onSelectSession: (sessionId: string) => void;
}

export const SessionSidebar = ({ onSelectSession }: SessionSidebarProps) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => getSessions(),
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteSession, isLoading: deleting } = useMutation({
    mutationFn: (id: string) => deleteSessionById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    }
  });

  // No periodic polling; user actions cause invalidation

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-sm font-semibold">Sessions</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading…</div>
        ) : (
          <ul className="divide-y">
            {(data?.sessions || []).map((s) => (
              <li key={s.sessionId} className="group flex items-start justify-between gap-2 p-3 hover:bg-muted/50">
                <button
                  className="text-left flex-1"
                  onClick={() => onSelectSession(s.sessionId)}
                >
                  <div className="text-sm font-medium line-clamp-1">{s.input || "Untitled"}</div>
                  <div className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleString()}</div>
                </button>
                <DeleteWithConfirm
                  onConfirm={() => deleteSession(s.sessionId)}
                  disabled={deleting}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const DeleteWithConfirm = ({ onConfirm, disabled }: { onConfirm: () => void; disabled?: boolean }) => {
  const id = `confirm-${Math.random().toString(36).slice(2)}`;
  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        aria-label="Delete session"
        disabled={disabled}
        onClick={() => {
          const dialog = document.getElementById(id) as HTMLDialogElement | null;
          dialog?.showModal();
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <dialog id={id} className="rounded-md p-0">
        <div className="p-4">
          <div className="text-sm font-medium mb-2">Delete session?</div>
          <div className="text-xs text-muted-foreground mb-4">This action cannot be undone.</div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => (document.getElementById(id) as HTMLDialogElement)?.close()}>Cancel</Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onConfirm();
                (document.getElementById(id) as HTMLDialogElement)?.close();
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
};



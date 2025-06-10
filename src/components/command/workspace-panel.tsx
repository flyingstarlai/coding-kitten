import React, {
  forwardRef,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type {
  IWorkspaceItem,
  ILoopCommand,
} from "@/components/command/types.ts";
import { useDragDropStore } from "@/store/use-drag-drop-store.ts";
import { LoopCommand } from "@/components/command/loop-command.tsx";
import { BaseCommand } from "@/components/command/base-command.tsx";
import clsx from "clsx";
import { Insertion } from "@/components/command/insertion.tsx";
import { onWorkspacePointerDown } from "@/components/command/utils/workspace-panel-utils.ts";
import { CommandControls } from "@/components/command/command-controls.tsx";
import { queueWorkspaceSequence } from "@/game/utils/command-utils.ts";
import { useEntityQuery } from "@/game/hooks/use-entity-query.ts";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";

export const WorkspacePanel = forwardRef<HTMLDivElement>((_, ref) => {
  const {
    draggingItem,
    setDraggingItem,
    setHoveredLoopId,
    setPointer,
    workspaceItems,
    insertionIndex,
  } = useDragDropStore();

  const [playerEid] = useEntityQuery(["playerTag"]);
  const currentCommand = useEcsStore((s) => s.currentCommand);
  const [managerEid] = useEntityQuery(["managerTag"]);
  const progressFacet = useEcsStore((s) =>
    s.getComponent(managerEid!, "progress"),
  );
  const setCurrentCommand = useEcsStore((s) => s.setCurrentCommand);

  // State to track whether a sequence is in progress
  const [isRunning, setIsRunning] = useState(false);

  // Mutable ref to signal when a stop is requested
  const stopRef = useRef(false);

  // Filter out the item currently being dragged
  const visibleItems: IWorkspaceItem[] = draggingItem
    ? workspaceItems.filter((item) => item.id !== draggingItem.id)
    : workspaceItems;

  // Start running the sequence; clear any previous stop flag
  const runSequence = useCallback(async () => {
    stopRef.current = false;
    setIsRunning(true);

    if (playerEid !== undefined) {
      queueWorkspaceSequence(workspaceItems, playerEid);
    }

    setIsRunning(false);
  }, [playerEid, workspaceItems]);

  // Called when the user clicks “Stop”
  const onStop = useCallback(() => {
    stopRef.current = true;
    setCurrentCommand(null);
    setIsRunning(false);
  }, [setCurrentCommand]);

  // Renders each item with a highlight if it is currently running
  const renderItem = (item: IWorkspaceItem, idx: number): ReactNode => {
    const isRunningThisItem =
      currentCommand !== null &&
      currentCommand.parentId === null &&
      currentCommand.id === item.id;

    return (
      <React.Fragment key={item.id}>
        {insertionIndex === idx && draggingItem && (
          <div className="flex items-center gap-1">
            <Insertion type="workspace" />
          </div>
        )}

        <div
          onPointerDown={(e) =>
            onWorkspacePointerDown(
              e,
              item,
              setHoveredLoopId,
              setDraggingItem,
              setPointer,
            )
          }
          className={clsx(
            "workspace-block flex items-center gap-1",
            draggingItem?.id === item.id && "opacity-50",
          )}
          data-id={item.id}
        >
          <div data-drag-handle="container">
            {item.command === "loop" ? (
              <LoopCommand
                item={item as ILoopCommand}
                type="workspace"
                runningCommand={currentCommand}
              />
            ) : (
              <div
                className={clsx(
                  "transition-all duration-200",
                  isRunningThisItem &&
                    "bg-blue-50/50 ring-4 ring-blue-400 rounded animate-pulse",
                  isRunningThisItem &&
                    progressFacet?.isOver &&
                    !progressFacet?.onGoal &&
                    "bg-orange-50/50 ring-orange-400",
                )}
              >
                <BaseCommand item={item} type="workspace" />
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className="py-2 px-4 flex items-center justify-between border rounded">
      <div
        ref={ref}
        data-dropzone="workspace"
        className="flex w-full flex-wrap gap-2 min-h-[108px]"
      >
        {visibleItems.map((item, idx) => renderItem(item, idx))}

        {insertionIndex === visibleItems.length && draggingItem && (
          <div className="flex items-center gap-1">
            <Insertion type="workspace" />
          </div>
        )}
      </div>

      <CommandControls
        isRunning={isRunning}
        onRun={runSequence}
        onStop={onStop}
        disabled={workspaceItems.length === 0}
      />
    </div>
  );
});

import { forwardRef } from "react";
import { useDragDropStore } from "@/store/use-drag-drop-store.ts";
import { COMMAND_ITEMS } from "@/components/command/constants.ts";
import { BaseCommand } from "@/components/command/base-command.tsx";
import { LoopCommand } from "@/components/command/loop-command.tsx";
import clsx from "clsx";
import { onPalettePointerDown } from "@/components/command/utils/palette-panel-utils.ts";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";

export const PalettePanel = forwardRef<HTMLDivElement>((_, ref) => {
  const { setDraggingItem, setPointer, isOverDeleteZone } = useDragDropStore();
  const availableCommands = useEcsStore((s) => s.level).commands;

  const paletteItems = COMMAND_ITEMS.filter((item) =>
    availableCommands.includes(item.command),
  );

  return (
    <div
      ref={ref}
      data-dropzone="palette"
      className={clsx(
        "p-4 border rounded flex flex-wrap gap-2 transition-colors duration-200",
        isOverDeleteZone && "bg-red-200/20 border-red-200/20",
      )}
    >
      {paletteItems.map((item) => (
        <div
          key={item.id}
          onPointerDown={(e) =>
            onPalettePointerDown(e, item, setDraggingItem, setPointer)
          }
          className="cursor-grab select-none touch-none"
        >
          {item.command === "loop" ? (
            <LoopCommand type="palette" item={item} runningCommand={null} />
          ) : (
            <BaseCommand type="palette" item={item} />
          )}
        </div>
      ))}
    </div>
  );
});

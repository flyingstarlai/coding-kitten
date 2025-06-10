import { useEntityQuery } from "@/game/hooks/use-entity-query.ts";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { useMovementStore } from "@/game/store/use-movement-store.ts";

export const GraphicRenderSystem: React.FC = () => {
  const entities = useEntityQuery(["display"]);
  return (
    <>
      {entities.map((id) => (
        <EntityGraphic key={id} eid={id} />
      ))}
    </>
  );
};

const EntityGraphic: React.FC<{ eid: number }> = ({ eid }) => {
  const position = useMovementStore((s) => s.getComponent(eid, "position"));
  const display = useEcsStore((s) => s.getComponent(eid, "display"));
  if (!position || !display) return null;

  return (
    <pixiContainer
      key={eid}
      x={position.x}
      y={position.y}
      pivot={display.size / 2}
    >
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.setFillStyle({ color: display.color, alpha: 0.3 });
          g.rect(0, 0, display.size ?? 40, display.size ?? 40);
          g.fill();
        }}
      />
    </pixiContainer>
  );
};

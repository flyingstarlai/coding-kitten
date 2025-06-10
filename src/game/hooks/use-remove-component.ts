import { useEcsStore } from "@/game/store/use-ecs-store.ts";

const useRemoveComponent = () => useEcsStore((s) => s.removeComponent);
export default useRemoveComponent;

import { useEcsStore } from "@/game/store/use-ecs-store.ts";

const useAddComponent = () => useEcsStore((s) => s.addComponent);
export default useAddComponent;

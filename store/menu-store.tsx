import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type MenuItem<T = any, TG = any> = {
  value: T;
  target: TG | null;
  clicks: number;
  registerTarget: (target: TG) => void;
  setValue: (value: T) => void;
};

type MenuStateItem<T = any, TG = any> = {
  value: T;
  target: TG | null;
  clicks: number;
};

type MenuStore = {
  menus: Record<string, MenuStateItem>;
  registerMenu: <T>(id: string, initialValue: T) => void;
  updateTarget: <TG>(id: string, target: TG) => void;
  updateValue: <T>(id: string, value: T) => void;
  updateClick: (id: string) => void;
  getMenu: <T, TG>(id: string) => MenuItem<T, TG> | undefined;
};

export const menuStore = create<MenuStore>()(
  subscribeWithSelector((set, get) => ({
    menus: {},

    updateClick: (id: string) => {
      const key = id.toLowerCase();
      const menu = get().menus[key];
      let clicks = menu.clicks;
      clicks += 1;

      if (menu) {
        set((state) => ({
          menus: {
            ...state.menus,
            [key]: { ...menu, clicks },
          },
        }));
      }
    },

    registerMenu: <T, TG>(id: string, initialValue: T) => {
      const key = id.toLowerCase();

      if (!get().menus[key]) {
        set((state) => ({
          menus: {
            ...state.menus,
            [key]: {
              value: initialValue,
              target: null,
              clicks: 0,
            },
          },
        }));
      }
    },

    updateTarget: <TG,>(id: string, target: TG) => {
      const key = id.toLowerCase();
      const menu = get().menus[key];

      if (menu) {
        set((state) => ({
          menus: {
            ...state.menus,
            [key]: { ...menu, target },
          },
        }));
      }
    },

    updateValue: <T,>(id: string, value: T) => {
      const key = id.toLowerCase();
      const menu = get().menus[key];

      if (menu) {
        set((state) => ({
          menus: {
            ...state.menus,
            [key]: { ...menu, value },
          },
        }));
      }
    },

    getMenu: <T, TG>(id: string): MenuItem<T, TG> | undefined => {
      const key = id.toLowerCase();
      const menu = get().menus[key];

      if (!menu) return undefined;

      return {
        value: menu.value as T,
        target: menu.target as TG | null,
        clicks: menu.clicks,
        registerTarget: (target: TG) => get().updateTarget(id, target),
        setValue: (value: T) => get().updateValue(id, value),
      };
    },
  })),
);

export function useContextMenu<T = unknown, TG = unknown>(id: string) {
  const key = id?.toLowerCase();

  const value = menuStore((state) => state.menus[key]?.value as T | undefined);
  const target = menuStore(
    (state) => state.menus[key]?.target as TG | null | undefined,
  );
  const clicks = menuStore((state) => state.getMenu(id)?.clicks);
  const registerMenu = menuStore((state) => state.registerMenu);
  const updateTarget = menuStore((state) => state.updateTarget);
  const updateValue = menuStore((state) => state.updateValue);
  const updateClick = menuStore((state) => state.updateClick);
  const menu = menuStore.getState().menus[key];
  if (!menu) {
    registerMenu(key, null);
  }

  return {
    value,
    target,
    clicks,
    click: () => updateClick(id),
    setValue: (newValue: T) => updateValue(id, newValue),
    setTarget: (newTarget: TG) => updateTarget(id, newTarget),
  };
}

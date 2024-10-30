import { t } from "@/i18n";
import { createDialog } from "../dialogs/dialog";
import { createSignal, For } from "solid-js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { toast } from "solid-sonner";

export const createClipboardHistoryDialog = () => {
  const {
    open: openDialog,
    close,
    submit,
    Component,
  } = createDialog({
    title: () => t("common.clipboard_history.title"),
    content: () => (
      <div class="max-h-[60vh] overflow-y-auto">
        <ul class="flex flex-col gap-2">
          <For each={clipboardCacheData()}>
            {(item) => (
              <Tooltip>
                <TooltipTrigger
                  as="li"
                  class="line-clamp-2 cursor-pointer overflow-hidden
                    whitespace-pre-wrap text-wrap rounded-md border
                    border-border p-1 text-sm hover:bg-muted"
                >
                  <li
                    onClick={() => {
                      navigator.clipboard &&
                        navigator.clipboard.writeText(item).then(() => {
                          toast.success(t("common.notification.copy_success"));
                        });
                    }}
                  >
                    {item}
                  </li>
                </TooltipTrigger>
                <TooltipContent class="whitespace-pre-wrap">
                  {item}
                </TooltipContent>
              </Tooltip>
            )}
          </For>
        </ul>
      </div>
    ),
  });

  const [clipboardCacheData, setClipboardCacheData] =
    createSignal<string[]>([]);

  const open = (clipboardCacheData: string[]) => {
    setClipboardCacheData(clipboardCacheData);
    openDialog();
  };

  return { open, Component };
};

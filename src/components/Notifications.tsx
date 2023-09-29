import { Context } from "@/contexts/Context";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useContextSelector } from "use-context-selector";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { dateFormatter } from "@/utils/formatter";

export function Notifications() {
  const notifications = useContextSelector(Context, (context) => {
    return context.notifications;
  });

  return (
    <Dialog.Portal>
      <div className="fixed w-full h-full inset-0 bg-black bg-opacity-75">
        <div className="w-[85%] h-[500px] md:w-[35%] mx-auto p-10 bg-gray-800 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md">
          <Dialog.Title className="text-white">Notificações</Dialog.Title>
          <Dialog.Close className="absolute top-6 right-6 bg-transparent border-0 cursor-pointer text-gray-500">
            <X size={24} />
          </Dialog.Close>
          <div className="w-full h-[350px] pr-4 overflow-y-scroll flex flex-col gap-4 mt-8">
            {notifications.map((notification, index) => (
              <Accordion.Root
                key={index}
                className="w-full flex items-center gap-2 rounded-lg py-2 px-4 bg-gray-700"
                type="single"
                collapsible
              >
                <Accordion.Item
                  className="w-full overflow-hidden first:mt-0 first:rounded-t-[4px] last:rounded-b-[4px] focus-within:relative focus-within:z-[1] group"
                  value="item-1"
                >
                  <div className="w-full flex justify-between items-center">
                    <Accordion.Trigger className="w-full bg-transparent h-fit flex-1 py-2 grid grid-cols-[1fr_0.15fr] items-center text-start text-sm sm:text-[1rem] leading-[1] text-white">
                      {notification.title}
                      <ChevronDownIcon
                        className="w-full text-red group-data-[state=open]:rotate-180"
                        aria-hidden
                      />
                    </Accordion.Trigger>
                  </div>
                  <Accordion.Content className="w-full flex flex-col gap-2 overflow-hidden">
                    <span className="w-full text-sm text-white mt-4">
                      {notification.content}
                    </span>
                    <span className="w-full text-sm text-white">
                      {dateFormatter.format(new Date(notification.createdAt))}
                    </span>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            ))}
          </div>
        </div>
      </div>
    </Dialog.Portal>
  );
}

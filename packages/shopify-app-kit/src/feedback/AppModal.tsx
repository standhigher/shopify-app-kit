import { useContext, useEffect, useRef } from "react";
import { Modal } from "@shopify/polaris";
import { ShopifyAppKitContext } from "../providers/ShopifyAppKitContext";

export interface AppModalProps {
  open: boolean;
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
}

const openModalClosers: Array<() => void> = [];
let modalKeyListenerInstalled = false;
let originalBodyOverflow = "";

function handleModalKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    openModalClosers[openModalClosers.length - 1]?.();
    event.stopPropagation();
  }
}

export function AppModal({ open, title, children, footer, onClose }: AppModalProps) {
  const previousFocus = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const CustomRenderer = useContext(ShopifyAppKitContext)?.renderers?.modal;

  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const close = () => onCloseRef.current();
    if (openModalClosers.length === 0) {
      originalBodyOverflow = document.body.style.overflow;
      document.addEventListener("keydown", handleModalKeyDown, true);
      modalKeyListenerInstalled = true;
    }
    openModalClosers.push(close);
    document.body.style.overflow = "hidden";
    return () => {
      const index = openModalClosers.lastIndexOf(close);
      if (index >= 0) openModalClosers.splice(index, 1);
      if (openModalClosers.length === 0) {
        document.body.style.overflow = originalBodyOverflow;
        if (modalKeyListenerInstalled) document.removeEventListener("keydown", handleModalKeyDown, true);
        modalKeyListenerInstalled = false;
      } else {
        document.body.style.overflow = "hidden";
      }
      const target = previousFocus.current;
      if (target && target.isConnected) {
        target.focus();
        requestAnimationFrame(() => target.focus());
        window.setTimeout(() => target.focus(), 0);
      }
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const DefaultModal = (props: AppModalProps) => (
    <Modal open={props.open} title={props.title} onClose={props.onClose} footer={props.footer}>
      {props.children}
    </Modal>
  );
  if (CustomRenderer) {
    return <CustomRenderer open={open} title={title} footer={footer} onClose={onClose} DefaultComponent={DefaultModal}>{children}</CustomRenderer>;
  }
  return <DefaultModal open={open} title={title} footer={footer} onClose={onClose}>{children}</DefaultModal>;
}

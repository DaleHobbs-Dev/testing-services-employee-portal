import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@/components";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  warning,
  isDeleting = false,
  confirmLabel = "Delete",
  workingLabel = "Deleting...",
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-500/25 flex items-center justify-center ring-1 ring-red-200 dark:ring-red-400/50">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-950 dark:text-red-50">
            {title || "Confirm Deletion"}
          </h2>
        </div>
      </ModalHeader>

      <ModalBody>
        <p className="text-adaptive-muted mb-2">
          {message || "Are you sure you want to delete this item?"}
        </p>
        {itemName && (
          <p className="text-adaptive font-semibold bg-muted p-3 rounded border-l-4 border-red-500">
            "{itemName}"
          </p>
        )}
        {warning !== null && (
          <p className="text-adaptive-muted text-sm mt-3">
            {warning ||
              "This will hide it from the system. This action can be reversed by an administrator."}
          </p>
        )}
      </ModalBody>

      <ModalFooter className="flex justify-end gap-3">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isDeleting}
          className="focus-ring"
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={isDeleting}
          className="focus-ring shadow-sm shadow-red-900/20 dark:shadow-red-500/20"
        >
          {isDeleting ? workingLabel : confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

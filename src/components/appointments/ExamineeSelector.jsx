import { useState } from "react";
import {
  Button,
  Input,
  Label,
  H2,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui";
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  UserCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { createExaminee } from "@/services";

export default function ExamineeSelector({
  examinees,
  selectedExaminee,
  onExamineeSelected,
  onExamineeAdded,
}) {
  const [emailSearch, setEmailSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExamineeData, setNewExamineeData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleSearchByEmail = () => {
    const found = examinees.find(
      (e) => e.email.toLowerCase() === emailSearch.toLowerCase()
    );
    if (found) {
      onExamineeSelected(found);
    } else {
      alert("No examinee found with that email.");
    }
  };

  const handleAddNewExaminee = async () => {
    const created = await createExaminee(newExamineeData);
    onExamineeAdded(created);
    onExamineeSelected(created);
    setShowAddModal(false);
    setNewExamineeData({ firstName: "", lastName: "", email: "" });
  };

  return (
    <>
      <H2 className="mb-4">
        <div className="p-2 flex items-center gap-3 rounded-lg bg-primary-light/20 text-primary">
          <UserCircleIcon className="w-8 h-8 text-primary" />
          Examinee Information
        </div>
      </H2>

      {/* LOOKUP EXISTING */}
      <div className="mb-6">
        <Label>Email Lookup</Label>
        <div className="flex gap-3 mt-2">
          <Input
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
            placeholder="Enter examinee email"
          />
          <Button onClick={handleSearchByEmail}>
            <MagnifyingGlassIcon className="w-5 h-5 mr-2 inline" />
            Search
          </Button>
        </div>
      </div>

      {/* SHOW SELECTED EXAMINEE */}
      {selectedExaminee && (
        <Alert className="bg-green-50 border-green-300 text-green-700 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 shrink-0" />
            <span>
              Selected Examinee:{" "}
              <strong>
                {selectedExaminee.firstName} {selectedExaminee.lastName}
              </strong>{" "}
              ({selectedExaminee.email})
            </span>
          </div>
          <Button
            variant="outline"
            className="ml-4"
            onClick={() => {
              onExamineeSelected(null);
              setEmailSearch("");
            }}
          >
            Select Different Examinee
          </Button>
        </Alert>
      )}

      <Button
        variant="accent"
        className="mb-8"
        onClick={() => setShowAddModal(true)}
      >
        <UserPlusIcon className="w-5 h-5 mr-2 inline" />
        Add New Examinee
      </Button>

      {/* ADD EXAMINEE MODAL */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <ModalHeader>Add New Examinee</ModalHeader>
        <ModalBody>
          <Label>First Name</Label>
          <Input
            value={newExamineeData.firstName}
            onChange={(e) =>
              setNewExamineeData({
                ...newExamineeData,
                firstName: e.target.value,
              })
            }
          />

          <Label className="mt-3">Last Name</Label>
          <Input
            value={newExamineeData.lastName}
            onChange={(e) =>
              setNewExamineeData({
                ...newExamineeData,
                lastName: e.target.value,
              })
            }
          />

          <Label className="mt-3">Email</Label>
          <Input
            value={newExamineeData.email}
            onChange={(e) =>
              setNewExamineeData({ ...newExamineeData, email: e.target.value })
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddNewExaminee}>
            Add Examinee
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

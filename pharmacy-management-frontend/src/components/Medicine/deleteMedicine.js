import { Button, Modal, notification } from "antd";
import { deleteMedicine } from "../../api/medicine"; // Delete API function

const DeleteMedicine = ({ medicineId, onMedicineDeleted }) => {
  console.log("medicalId===",medicineId )
  const handleDelete = async () => {
    try {
      await deleteMedicine(medicineId); // API call to delete medicine
      notification.success({
        message: "Success",
        description: "Medicine deleted successfully",
      });
      if (onMedicineDeleted) {
        onMedicineDeleted(); // Call the passed function to refresh the list
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to delete medicine",
      });
    }
  };

  return (
    <Button type="link" danger onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteMedicine;

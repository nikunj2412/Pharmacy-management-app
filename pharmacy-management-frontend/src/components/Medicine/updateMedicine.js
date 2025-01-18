import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, DatePicker, notification } from "antd";
import { updateMedicine } from "../../api/medicine";
import moment from "moment";

const UpdateMedicine = ({ medicine, onMedicineUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Use Form instance for dynamic updates

  useEffect(() => {
    if (medicine) {
      form.setFieldsValue({
        name: medicine.name || "",
        Quantity: medicine.Quantity || "",
        price: medicine.price || "",
        accualPrice: medicine.accualPrice || "", // Add actual price field
        expiry: medicine.expiry ? moment(medicine.expiry) : null,
      });
    }
  }, [medicine, form]); // Trigger whenever `medicine` changes

  const handleFinish = async (values) => {
    const medicineId = medicine?.id || medicine?._id;
    if (!medicineId) {
      notification.error({
        message: "Error",
        description: "Medicine ID is not found.",
      });
      return;
    }

    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        expiry: values.expiry ? values.expiry.toISOString() : null,
      };
      await updateMedicine(medicineId, formattedValues);
      notification.success({
        message: "Success",
        description: "Medicine updated successfully!",
      });
      onMedicineUpdated();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to update medicine.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form} // Pass the form instance
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: false, message: "Please enter the medicine name" }]} // Add required
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Quantity"
        name="Quantity"
        rules={[{ required: false, message: "Please enter the quantity" }]} // Add required
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: false, message: "Please enter the price" }]} // Add required
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Actual Price"
        name="accualPrice"
        rules={[{ required: false, message: "Please enter the actual price" }]} // Add required
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Expiry Date"
        name="expiry"
        rules={[{ required: false, message: "Please select the expiry date" }]} // Add required
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Update Medicine
      </Button>
    </Form>
  );
};

export default UpdateMedicine;

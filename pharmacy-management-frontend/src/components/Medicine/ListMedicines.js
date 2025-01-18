import React, { useEffect, useState } from "react";
import { getAllMedicines } from "../../api/medicine";

const ListMedicines = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllMedicines();
      setMedicines(data.results);
    };
    fetchData();
  }, []);

  return (
    <ul>
      {medicines.map((medicine) => (
        <li key={medicine._id}>
          {medicine.name} - {medicine.price}
        </li>
      ))}
    </ul>
  );
};

export default ListMedicines;

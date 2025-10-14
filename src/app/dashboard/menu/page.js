// src/app/dashboard/menu/page.js
import MenuTable from '../../../components/MenuTable';

export default function MenuPage() {
  return (
    <div>
      {/* Komponen MenuTable sudah memiliki judul sendiri, jadi kita bisa langsung menampilkannya */}
      <MenuTable />
    </div>
  );
}

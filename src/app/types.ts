export interface Pilihan {
  pilihan: string;
  harga_jual: string;
  modal: string;
}

export interface Opsi {
  _id: string;
  nama_opsi: string;
  list_opsi: Pilihan[];
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stok: number;
  opsi: Opsi[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  pilihan_opsi?: { [key: string]: string };
  cartItemId: string;
}

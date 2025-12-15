'use client';

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from 'next/navigation';
import axios from "axios";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import OptionSelectionModal from "./components/OptionSelectionModal";
import {
  ShoppingCart,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { MenuItem, CartItem } from "./types";

// --- Tipe untuk Payload Pesanan ---
interface OpsiTerpilihPayload {
  nama_opsi: string;
  pilihan: string;
}

interface OrderItemPayload {
  menuId: string;
  jumlah: number;
  opsi_terpilih: OpsiTerpilihPayload[];
}

interface OrderPayload {
  nama_pelanggan: string;
  no_wa_pelanggan: string;
  items: OrderItemPayload[];
  nomor_meja: string;
}
// ------------------------------------

export default function Home() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerWa, setCustomerWa] = useState("");
  const [customerTable, setCustomerTable] = useState("");
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageToZoom, setImageToZoom] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const tableNumber = searchParams.get('meja');
    if (tableNumber) {
      setCustomerTable(tableNumber);
    }
  }, [searchParams]);

  const fetchMenu = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/menu/order`);
      setMenu(response.data);
    } catch (error) {
      console.error("Failed to fetch menu:", error);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const calculateItemTotalPrice = useCallback((cartItem: CartItem) => {
    let itemPrice = cartItem.price;
    if (cartItem.pilihan_opsi) {
      for (const namaOpsi in cartItem.pilihan_opsi) {
        const pilihanNama = cartItem.pilihan_opsi[namaOpsi];
        const opsiGroup = cartItem.opsi.find(og => og.nama_opsi === namaOpsi);
        if (opsiGroup) {
          const pilihanData = opsiGroup.list_opsi.find(p => p.pilihan === pilihanNama);
          if (pilihanData) {
            itemPrice += Number(pilihanData.harga_jual);
          }
        }
      }
    }
    return itemPrice * cartItem.quantity;
  }, []);

  const handleOpenOptionsModal = (item: MenuItem) => {
    setSelectedMenu(item);
  };

  const handleConfirmAddToCart = (item: CartItem) => {
    setCart((prevCart) => [...prevCart, item]);
    setSelectedMenu(null); 
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const handleNonOpsiAddToCart = (item: MenuItem) => {
    if (item.stok <= 0) return;
    const newItem: CartItem = {
      ...item,
      quantity: 1,
      cartItemId: `${item._id}-${Date.now()}`
    };
    setCart((prevCart) => [...prevCart, newItem]);
  };

  const handleUpdateNonOpsiQuantity = (cartItemId: string, amount: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQuantity = item.quantity + amount;
          if (newQuantity <= 0) return null; 
          if (newQuantity > item.stok) {
            alert(`Maaf, stok untuk ${item.name} hanya tersisa ${item.stok}.`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[]
    );
  };

  const { totalItems, totalPrice } = useMemo(() => {
    let calculatedTotalItems = 0;
    let calculatedTotalPrice = 0;
    cart.forEach(cartItem => {
      calculatedTotalItems += cartItem.quantity;
      calculatedTotalPrice += calculateItemTotalPrice(cartItem);
    });
    return { totalItems: calculatedTotalItems, totalPrice: calculatedTotalPrice };
  }, [cart, calculateItemTotalPrice]);

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      alert("Keranjang Kakak masih kosong.");
      return;
    }
    if (!customerName.trim() || !customerWa.trim()) {
      alert("Mohon isi Nama dan Nomor WhatsApp Kakak ya");
      return;
    }
    // Validasi nomor meja dihapus

    setIsSubmitting(true);
    const formattedWa = customerWa.startsWith("0") ? `62${customerWa.substring(1)}` : customerWa;
    
    const orderItemsPayload = cart.map(item => {
      const opsiTerpilihPayload = item.pilihan_opsi ? Object.keys(item.pilihan_opsi).map(namaOpsi => ({
        nama_opsi: namaOpsi,
        pilihan: item.pilihan_opsi![namaOpsi]
      })) : [];

      return {
        menuId: item._id,
        jumlah: item.quantity,
        opsi_terpilih: opsiTerpilihPayload,
      };
    });

    const orderData: OrderPayload = {
      nama_pelanggan: customerName,
      no_wa_pelanggan: formattedWa,
      items: orderItemsPayload,
      nomor_meja : customerTable,
    };

    //
    // if (customerTable) {
    //   orderData.nomor_meja = customerTable;
    // }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/order`, orderData);
      alert("Sipp Kakak! Pesananmu sudah kami terima dan sedang diproses.");
      fetchMenu();
      setIsCartModalOpen(false);
      setCart([]);
      setCustomerName("");
      setCustomerWa("");
    } catch (error) {
      console.error("Failed to submit order:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Gagal mengirim pesanan: ${error.response.data.message || 'Terjadi kesalahan'}`);
      } else {
        alert('Terjadi kesalahan saat mengirim pesanan.');
      }
    } finally {
        setIsSubmitting(false);
    }
  };

  const availableStockForModal = useMemo(() => {
    if (!selectedMenu) return 0;
    const quantityInCart = cart
      .filter(item => item._id === selectedMenu._id)
      .reduce((sum, item) => sum + item.quantity, 0);
    return selectedMenu.stok - quantityInCart;
  }, [selectedMenu, cart]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Navbar />

      <main className="relative flex-grow container mx-auto flex flex-col items-center text-center p-4 md:p-8 overflow-hidden">
        <div className="relative z-10 w-full">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Selamat Datang di Bakso Pedas Nikmat
            </h2>
            {customerTable && (
              <p className="text-xl text-emerald-600 font-semibold bg-emerald-100 border border-emerald-300 rounded-lg py-2 px-4 inline-block">
                Anda memesan dari meja : {customerTable}
              </p>
            )}
            <p className="text-lg text-gray-600 mt-4">
              Silakan pilih menu favoritmu
            </p>
          </div>

          <div className="w-full max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {menu.map((item) => {
                const hasOptions = item.opsi && item.opsi.length > 0;
                const quantityInCart = cart
                  .filter(cartItem => cartItem._id === item._id)
                  .reduce((sum, cartItem) => sum + cartItem.quantity, 0);
                const availableStock = item.stok - quantityInCart;
                const isOutOfStock = availableStock <= 0;
                const cartItemForNonOpsi = cart.find(ci => ci._id === item._id && !ci.pilihan_opsi);

                return (
                  <div key={item._id} className="group relative rounded-lg shadow-lg overflow-hidden h-96">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}${item.imageUrl}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div 
                      onClick={() => setImageToZoom(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}${item.imageUrl}`)}
                      className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <p className="text-white font-semibold">Klik untuk perbesar</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-white/80 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600 my-2">{item.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-lg font-semibold text-emerald-600">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                        
                        {isOutOfStock ? (
                          <span className="font-semibold text-red-500 bg-red-100 px-4 py-2 rounded-lg">Stok Habis</span>
                        ) : hasOptions ? (
                          <button onClick={() => handleOpenOptionsModal(item)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                            Tambah
                          </button>
                        ) : cartItemForNonOpsi ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleUpdateNonOpsiQuantity(cartItemForNonOpsi.cartItemId, -1)} className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors">
                              <Minus size={16} />
                            </button>
                            <span className="font-bold text-lg w-8 text-center text-sky-600">{cartItemForNonOpsi.quantity}</span>
                            <button 
                              onClick={() => handleUpdateNonOpsiQuantity(cartItemForNonOpsi.cartItemId, 1)} 
                              disabled={cartItemForNonOpsi.quantity >= availableStock}
                              className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => handleNonOpsiAddToCart(item)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                            Tambah
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {cart.length > 0 && (
        <div className="sticky bottom-0 z-20 bg-white shadow-2xl p-4 border-t-2 border-emerald-500">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ShoppingCart className="text-emerald-600" />
                  <div className="text-xl font-bold text-gray-600">Total Pesanan ({totalItems} item)</div>
              </h3>
              <p className="text-2xl font-bold text-emerald-700">Rp {totalPrice.toLocaleString("id-ID")}</p>
            </div>
            <button
              onClick={() => setIsCartModalOpen(true)}
              className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg w-full md:w-auto hover:bg-emerald-700 transition-colors whitespace-nowrap"
            >
              Rincian Pesanan
            </button>
          </div>
        </div>
      )}

      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Konfirmasi Pesanan</h2>
              <button onClick={() => setIsCartModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name} (x{item.quantity})</p>
                      {item.pilihan_opsi && Object.keys(item.pilihan_opsi).length > 0 && (
                        <p className="text-sm text-gray-500">
                          {Object.keys(item.pilihan_opsi).map(namaOpsi => {
                            const pilihanNama = item.pilihan_opsi![namaOpsi];
                            const opsiGroup = item.opsi.find(og => og.nama_opsi === namaOpsi);
                            let optionPriceDisplay = '';
                            if (opsiGroup) {
                              const pilihanData = opsiGroup.list_opsi.find(p => p.pilihan === pilihanNama);
                              if (pilihanData && Number(pilihanData.harga_jual) > 0) {
                                optionPriceDisplay = ` (+${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(pilihanData.harga_jual))})`;
                              }
                            }
                            return `${pilihanNama}${optionPriceDisplay}`;
                          }).join(', ')}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold text-gray-800">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(calculateItemTotalPrice(item))}
                    </p>
                    <button onClick={() => handleRemoveFromCart(item.cartItemId)} className="text-red-500 hover:text-red-700 ml-4">
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <hr className="my-6" />

              <div className="flex justify-between text-2xl font-bold mb-6 text-emerald-700">
                <span>Total</span>
                <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>

              <div className="space-y-4">
                {customerTable && (
                  <div className="w-full text-lefttext-emerald-600 font-semibold bg-emerald-100 border border-emerald-300 rounded-lg py-2 px-4 inline-block">
                    <span className="font-semibold text-gray-600">Meja :</span>
                    <span className="font-semibold text-gray-800 ml-2">{customerTable}</span>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Nama Kakak"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-500 text-gray-700"
                />
                <input
                  type="tel"
                  placeholder="Nomor WhatsApp Kakak (cth: 08123456789)"
                  value={customerWa}
                  onChange={(e) => setCustomerWa(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-500 text-gray-700"
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-b-lg">
              <p className="text-center text-sm text-gray-500 mb-4">
                Ketika pesanan sudah ready, kami akan konfirmasi ke nomor WhatsApp Kakak.
              </p>
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors text-lg disabled:bg-emerald-500 disabled:cursor-not-allowed"
              >
                  {isSubmitting ? 'Loading...' : 'Kirim Pesanan'}
              </button>
            </div>
          </div>
        </div>
      )}

      <OptionSelectionModal 
        isOpen={!!selectedMenu}
        onClose={() => setSelectedMenu(null)}
        menuItem={selectedMenu}
        onAddToCart={handleConfirmAddToCart}
        availableStock={availableStockForModal}
      />

      {imageToZoom && (
        <div 
            onClick={() => setImageToZoom(null)} 
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
        >
            <div className="relative">
                <button 
                    onClick={() => setImageToZoom(null)} 
                    className="absolute -top-4 -right-4 bg-white rounded-full p-1 text-gray-800 hover:bg-gray-200"
                >
                    <X size={24} />
                </button>
                <img 
                    src={imageToZoom} 
                    alt="Zoomed"
                    className="max-w-[90vw] max-h-[90vh] object-contain"
                    onClick={(e) => e.stopPropagation()} 
                />
            </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

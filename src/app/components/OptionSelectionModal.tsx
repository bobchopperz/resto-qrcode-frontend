import { useState, useEffect } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
  onAddToCart: (item: CartItem) => void;
  availableStock: number; 
}

export default function OptionSelectionModal({ isOpen, onClose, menuItem, onAddToCart, availableStock }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [totalPrice, setTotalPrice] = useState(0); // <-- STATE BARU UNTUK TOTAL HARGA

  useEffect(() => {
    if (menuItem) {
      // Set default options
      const defaultOptions: { [key: string]: string } = {};
      if (menuItem.opsi && menuItem.opsi.length > 0) {
        menuItem.opsi.forEach(opsiGroup => {
          if (opsiGroup.list_opsi && opsiGroup.list_opsi.length > 0) {
            defaultOptions[opsiGroup.nama_opsi] = opsiGroup.list_opsi[0].pilihan;
          }
        });
      }
      setSelectedOptions(defaultOptions);
      setQuantity(1);
    }
  }, [menuItem]);

  // --- USE EFFECT BARU UNTUK MENGHITUNG HARGA ---
  useEffect(() => {
    if (!menuItem) return;

    // 1. Mulai dengan harga dasar menu
    let singleItemPrice = menuItem.price;

    // 2. Tambahkan harga dari setiap opsi yang dipilih
    if (menuItem.opsi && menuItem.opsi.length > 0) {
      for (const namaOpsi in selectedOptions) {
        const pilihanNama = selectedOptions[namaOpsi];
        
        const opsiGroup = menuItem.opsi.find(og => og.nama_opsi === namaOpsi);
        if (opsiGroup) {
          const pilihanData = opsiGroup.list_opsi.find(p => p.pilihan === pilihanNama);
          if (pilihanData) {
            singleItemPrice += Number(pilihanData.harga_jual);
          }
        }
      }
    }
    
    // 3. Kalikan dengan jumlah kuantitas
    setTotalPrice(singleItemPrice * quantity);

  }, [selectedOptions, quantity, menuItem]);


  if (!isOpen || !menuItem) {
    return null;
  }

  const handleOptionChange = (namaOpsi: string, pilihan: string) => {
    setSelectedOptions(prev => ({ ...prev, [namaOpsi]: pilihan }));
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => {
      const newQuantity = prev + amount;
      if (newQuantity < 1) return 1;
      if (newQuantity > availableStock) return availableStock;
      return newQuantity;
    });
  };

  const handleConfirm = () => {
    const cartItem: CartItem = {
      ...menuItem,
      quantity: quantity,
      pilihan_opsi: selectedOptions,
      cartItemId: `${menuItem._id}-${JSON.stringify(selectedOptions)}-${Date.now()}`,
    };
    onAddToCart(cartItem);
    onClose();
  };

  const hasOptions = menuItem.opsi && menuItem.opsi.length > 0;
  const isMaxStock = quantity >= availableStock;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-gray-800">{menuItem.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {hasOptions && menuItem.opsi.map(opsiGroup => (
            <fieldset key={opsiGroup._id} className="mb-6 border border-gray-300 p-4 rounded-md">
              <legend className="font-medium text-lg text-gray-700 mb-3 px-2">{opsiGroup.nama_opsi}</legend>
              <div className="space-y-3">
                {opsiGroup.list_opsi.map(pilihanObj => (
                  <div key={pilihanObj.pilihan} className="flex items-center">
                    <input
                      type="radio"
                      id={`${opsiGroup._id}-${pilihanObj.pilihan}`}
                      name={opsiGroup.nama_opsi}
                      value={pilihanObj.pilihan}
                      checked={selectedOptions[opsiGroup.nama_opsi] === pilihanObj.pilihan}
                      onChange={() => handleOptionChange(opsiGroup.nama_opsi, pilihanObj.pilihan)}
                      className="custom-radio"
                    />
                    <label htmlFor={`${opsiGroup._id}-${pilihanObj.pilihan}`} className="ml-3 flex justify-between w-full items-center text-md font-normal text-gray-700">
                      <span>{pilihanObj.pilihan}</span>
                      {Number(pilihanObj.harga_jual) > 0 && (
                        <span className="text-sm text-green-600 font-medium">
                          + {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(pilihanObj.harga_jual))}
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => handleQuantityChange(-1)} className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors">
              <Minus size={20} />
            </button>
            <span className="font-bold text-xl w-10 text-center text-sky-600">{quantity}</span>
            <button 
              onClick={() => handleQuantityChange(1)} 
              disabled={isMaxStock}
              className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
            </button>
          </div>
          {/* --- TOMBOL SIMPAN DIPERBARUI UNTUK MENAMPILKAN HARGA --- */}
          <button
            onClick={handleConfirm}
            className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors text-lg flex flex-col"
          >
            <span>Simpan</span>
            <span className="text-sm font-normal">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

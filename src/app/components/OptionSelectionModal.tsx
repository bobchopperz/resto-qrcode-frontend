import { useState, useEffect } from 'react';
import { Minus, Plus, X } from 'lucide-react';

interface Opsi {
  _id: string;
  nama_opsi: string;
  list_opsi: string[];
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stok: number;
  opsi: Opsi[];
}

interface CartItem extends MenuItem {
  quantity: number;
  pilihan_opsi?: { [key: string]: string };
  cartItemId: string;
}

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

  useEffect(() => {
    if (menuItem) {
      if (menuItem.opsi && menuItem.opsi.length > 0) {
        const defaultOptions: { [key: string]: string } = {};
        menuItem.opsi.forEach(opsiGroup => {
          defaultOptions[opsiGroup.nama_opsi] = opsiGroup.list_opsi[0];
        });
        setSelectedOptions(defaultOptions);
      }
      setQuantity(1);
    }
  }, [menuItem]);

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
      cartItemId: `${menuItem._id}-${Date.now()}`,
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
          <h3 className="text-2xl font-semibold text-gray-800">{menuItem.name}</h3> {/* --- PERBAIKAN DI SINI --- */}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {hasOptions && menuItem.opsi.map(opsiGroup => (
            <fieldset key={opsiGroup._id} className="mb-6 border border-gray-300 p-4 rounded-md">
              <legend className="font-medium text-lg text-gray-700 mb-3 px-2">{opsiGroup.nama_opsi}</legend> {/* --- PERBAIKAN DI SINI --- */}
              <div className="space-y-3">
                {opsiGroup.list_opsi.map(pilihan => (
                  <div key={pilihan} className="flex items-center">
                    <input
                      type="radio"
                      id={`${opsiGroup._id}-${pilihan}`}
                      name={opsiGroup.nama_opsi}
                      value={pilihan}
                      checked={selectedOptions[opsiGroup.nama_opsi] === pilihan}
                      onChange={() => handleOptionChange(opsiGroup.nama_opsi, pilihan)}
                      className="custom-radio"
                    />
                    <label htmlFor={`${opsiGroup._id}-${pilihan}`} className="ml-3 block text-md font-normal text-gray-700">
                      {pilihan}
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
          <button
            onClick={handleConfirm}
            className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors text-lg"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

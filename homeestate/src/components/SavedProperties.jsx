import React from 'react';
import ProductCard from './ProductCard';

export default function SavedProperties() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Мои закладки</h2>
      <p className="text-gray-600 mb-6">Здесь отображаются сохраненные вами объекты недвижимости.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {/* Заглушка, позже сюда передадим реальные данные с бэкенда */}
         <div className="p-8 border-2 border-dashed border-gray-300 rounded text-center text-gray-500 col-span-full">
            Вы пока не добавили ни одного объекта в избранное.
         </div>
      </div>
    </div>
  );
}
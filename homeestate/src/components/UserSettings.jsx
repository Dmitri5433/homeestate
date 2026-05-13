import React from 'react';

export default function UserSettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Настройки профиля</h2>
      <form className="flex flex-col gap-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Имя</label>
          <input type="text" className="w-full p-2 border rounded focus:ring focus:ring-blue-200 outline-none" placeholder="Дмитрий" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input type="email" className="w-full p-2 border rounded focus:ring focus:ring-blue-200 outline-none" placeholder="example@mail.com" />
        </div>
        <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-fit mt-2">
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}
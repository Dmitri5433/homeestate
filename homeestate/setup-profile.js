import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Если у тебя "type": "module" в package.json, используем такой обход для __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const profilePageCode = `import React, { useState } from 'react';
import SavedProperties from '../components/SavedProperties';
import UserSettings from '../components/UserSettings';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('saved');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Личный кабинет</h1>
      <div className="flex gap-4">
        <aside className="w-1/4">
          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('saved')}
              className={\`p-2 text-left rounded transition-colors \${activeTab === 'saved' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}\`}
            >
              Избранная недвижимость
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={\`p-2 text-left rounded transition-colors \${activeTab === 'settings' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}\`}
            >
              Настройки профиля
            </button>
            <button className="p-2 text-left rounded text-red-500 hover:bg-red-50 transition-colors mt-4">
              Выйти
            </button>
          </nav>
        </aside>
        <main className="w-3/4 bg-white p-6 rounded shadow">
          {activeTab === 'saved' && <SavedProperties />}
          {activeTab === 'settings' && <UserSettings />}
        </main>
      </div>
    </div>
  );
}`;

const savedPropertiesCode = `import React from 'react';
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
}`;

const userSettingsCode = `import React from 'react';

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
}`;

// Создаем папку pages, если ее нет
const pagesDir = path.join(__dirname, 'src', 'pages');
if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
}

// Записываем файлы
fs.writeFileSync(path.join(pagesDir, 'ProfilePage.jsx'), profilePageCode);
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'SavedProperties.jsx'), savedPropertiesCode);
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'UserSettings.jsx'), userSettingsCode);

console.log('✅ Компоненты личного кабинета успешно созданы!');
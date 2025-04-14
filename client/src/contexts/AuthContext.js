import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kullanıcı bilgilerini localStorage'dan yükleme
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Demo login fonksiyonu (gerçek uygulamada API ile yapılacak)
  const login = (email, password) => {
    // Demo giriş - geliştirme aşamasında kolaylık için
    const demoUser = {
      id: 1,
      name: 'Demo User',
      email: email,
      role: 'support'
    };

    setUser(demoUser);
    localStorage.setItem('user', JSON.stringify(demoUser));
    return true;
  };

  // Çıkış fonksiyonu
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
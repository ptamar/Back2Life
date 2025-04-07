// utils/coins.js

// Get coins from localStorage
export function getCoins() {
    if (typeof window !== 'undefined') {
      const coins = localStorage.getItem('coins');
      return coins ? parseInt(coins, 10) : 100; // Default to 100 coins
    }
    return 100;
  }
  
  // Save coins to localStorage
  export function saveCoins(amount) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('coins', amount.toString());
    }
  }
  
  // Add coins
  export function addCoins(amount) {
    const currentCoins = getCoins();
    const newTotal = currentCoins + amount;
    saveCoins(newTotal);
    return newTotal;
  }
  
  // Spend coins
  export function spendCoins(amount) {
    const currentCoins = getCoins();
    if (currentCoins >= amount) {
      const newTotal = currentCoins - amount;
      saveCoins(newTotal);
      return true;
    }
    return false;
  }
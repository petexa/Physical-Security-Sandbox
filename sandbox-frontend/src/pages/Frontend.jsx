import { useEffect } from 'react';
import ApiTester from '../components/frontend/ApiTester';
import { initializeData } from '../utils/initData';

export default function Frontend() {
  useEffect(() => {
    // Initialize data on component mount
    initializeData();
  }, []);

  return <ApiTester />;
}


import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const Address: React.FC = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState<AddressData>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      toast.error('Please fill in all address fields');
      return;
    }

    // Here you would typically save the address 
    // For now, we'll just show a success toast
    toast.success('Address saved successfully');
    
    // Optionally navigate back to home or another page
    navigate('/');
  };

  return (
    <div className="container max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Add Address</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
          <Input
            type="text"
            id="street"
            name="street"
            value={address.street}
            onChange={handleChange}
            placeholder="Enter street address"
            required
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <Input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={handleChange}
            placeholder="Enter city"
            required
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
          <Input
            type="text"
            id="state"
            name="state"
            value={address.state}
            onChange={handleChange}
            placeholder="Enter state"
            required
          />
        </div>
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
          <Input
            type="text"
            id="zipCode"
            name="zipCode"
            value={address.zipCode}
            onChange={handleChange}
            placeholder="Enter zip code"
            required
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
          <Input
            type="text"
            id="country"
            name="country"
            value={address.country}
            onChange={handleChange}
            placeholder="Enter country"
            required
          />
        </div>
        <Button type="submit" className="w-full">Save Address</Button>
      </form>
    </div>
  );
};

export default Address;

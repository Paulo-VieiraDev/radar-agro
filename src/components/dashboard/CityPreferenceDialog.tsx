'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

interface Props {
  currentCity: string;
  onCityChange: (newCity: string) => void;
}

export function CityPreferenceDialog({ currentCity, onCityChange }: Props) { // 2. Usamos o novo nome aqui
  const [city, setCity] = useState(currentCity);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onCityChange(city);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Cidade</DialogTitle>
          <DialogDescription>
            Digite a cidade para ver a previsão do tempo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">Cidade</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Visualizar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
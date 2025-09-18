export interface Upgrade {
  name: string;
  enabled: boolean;
  price: number;
  dependencies: Upgrade[];
}

export const automaticModeUpgrade = {
  name: 'Automatic Mode',
  enabled: false,
  price: 10,
  dependencies: []
}
export const fasterTruck1 = {
  name: 'Increase trucks speed',
  enabled: false,
  price: 20,
  dependencies: [automaticModeUpgrade]
}
export const newWarehouse = {
  name: 'Allow buying new warehouses',
  enabled: false,
  price: 40,
  dependencies: [automaticModeUpgrade]
}
export const reduceTruckPrice = {
  name: 'Reduce truck price',
  enabled: false,
  price: 100,
  dependencies: [newWarehouse]
}
export const reduceLockerPrice = {
  name: 'Reduce locker price',
  enabled: false,
  price: 100,
  dependencies: [newWarehouse]
}
export const reduceWarehousePrice = {
  name: 'Reduce warehouse price',
  enabled: false,
  price: 100,
  dependencies: [reduceLockerPrice]
}
export const reduceAutomaticModeTransferTime = {
  name: 'Reduce automatic mode transfer time',
  enabled: false,
  price: 500,
  dependencies: [automaticModeUpgrade]
}
export const reduceBeforeCollectTime = {
  name: 'Reduce the time before a customer collects their parcel',
  enabled: false,
  price: 100,
  dependencies: [fasterTruck1]
}
export const upgrades: Upgrade[] = [
  automaticModeUpgrade,
  fasterTruck1,
  newWarehouse,
  reduceTruckPrice,
  reduceLockerPrice,
  reduceWarehousePrice,
  reduceAutomaticModeTransferTime,
  reduceBeforeCollectTime
]

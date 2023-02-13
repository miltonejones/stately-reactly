export const handleObjectChange = machine => (ID, key, val) => {
  machine.send({
    type: 'CHANGE',
    ID,
    Value: val,
    Key: key, 
  })
}

export const handleObjectAdd = (machine, options = { field: 'name'}) => (value) => {
  const { field, ...rest } = options;
  machine.send({
    type: 'CHANGE',
    [field]: value,
    ...rest
  })
}

export const handleObjectDelete = machine => (ID) => {
  machine.send({
    type: 'CHANGE',
    ID,
    unlink: true 
  })
}
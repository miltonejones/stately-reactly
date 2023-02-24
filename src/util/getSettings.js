export const getSettings = (settings = []) => settings.reduce((items, res) => {
  items[res.SettingName] = res.SettingValue; //isNaN(res.SettingValue) ? res.SettingValue : Number(res.SettingValue);
  return items;
}, {});
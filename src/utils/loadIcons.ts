const importAll = (context: any) => {
  const keys = context.keys();
  const values = keys.map(context);
  const result: any = {};

  keys.forEach((key: any, index: any) => {
    const iconName = key.replace('./', '').replace('.svg', '');
    result[iconName] = values[index].default;
  });

  return result;
  console.log('result :>> ', result);
};

const icons = importAll(import.meta.glob('../assets/svgs/*.svg'));

export default icons;

export type SCPIDevice = {
  device: USBDevice;
  sendSCPICommand: (cmd: string) => Promise<void>;
}

export const connectToDevice = async (): Promise<SCPIDevice | null> => {
  try {
    const filters = [{ vendorId: 0x1234, productId: 0x0001 }]; // 実機値に合わせて
    const device = await navigator.usb.requestDevice({ filters });
    await device.open();
    if (!device.configuration) {
      await device.selectConfiguration(1);
    }
    // OUT エンドポイントを自動検出
    const cfg = device.configuration;
    if (!cfg) return null;
    for (const iface of cfg.interfaces) {
      for (const alt of iface.alternates) {
        const outEp = alt.endpoints.find(e => e.direction === 'out');
        if (!outEp) continue;
        await device.claimInterface(iface.interfaceNumber);
        if (alt.alternateSetting !== 0) {
          await device.selectAlternateInterface(iface.interfaceNumber, alt.alternateSetting);
        }
        const { endpointNumber } = outEp;
        const sendSCPICommand = async (cmd: string) => {
          if (!device || endpointNumber === undefined) return;
          const data = new TextEncoder().encode(cmd + '\n');
          try {
            await device.transferOut(endpointNumber, data);
            console.log(`Sent: ${cmd}`);
          } catch (err) {
            console.error('transferOut エラー:', err);
          }
        }
        return { device, sendSCPICommand, };
      }
    }
    throw new Error('OUT エンドポイントが見つかりません');
  } catch (err) {
    console.error(err);
  }
  return null;
}
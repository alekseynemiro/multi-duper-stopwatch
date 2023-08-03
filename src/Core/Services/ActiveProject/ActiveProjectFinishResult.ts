export type ActiveProjectFinishResult = {

  confirm: (sessionName: string | undefined) => Promise<void>;

  cancel: () => Promise<void>;

};

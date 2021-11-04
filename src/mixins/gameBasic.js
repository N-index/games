const dialogBeforeGame = {
  async beforeRouteLeave() {
    if (this.isStart) {
      return await new Promise((resolve) => {
        this.dialog.warning({
          title: "是否离开",
          content: `"${this.gameName}" 正在运行，是否离开？`,
          maskClosable: false,
          closable: false,
          positiveText: "离开",
          negativeText: "留下",
          onPositiveClick: () => {
            this.resetGame();
            resolve(true);
          },
          onNegativeClick: () => {
            resolve(false);
          },
        });
      });
    }
  },
};
export { dialogBeforeGame };

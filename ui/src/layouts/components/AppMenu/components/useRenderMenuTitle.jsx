export function useRenderMenuTitle() {
  const renderMenuTitle = (meta) => {
    const { title = "Please set title", icon } = meta;

    return icon ? (
      <>
        {/* <div class="nav-bar"></div> */}
        {/* <Icon icon={meta.icon}></Icon> */}
        <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
          {title}
        </span>
      </>
    ) : (
      <>
        <div class="nav-bar"></div>
        <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
          {title}
        </span>
      </>
    );
  };

  return {
    renderMenuTitle,
  };
}

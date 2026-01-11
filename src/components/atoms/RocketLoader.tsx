import "./RocketLoader.css";

const RocketLoader = () => {
  return (
    <div className="rocket-loader-container fixed inset-0 z-50 flex items-center justify-center bg-base-100 dark:bg-base-dark">
      <div className="rocket-loader-wrapper">
        <div>
          <div className="loader">
            <span>
              <span />
              <span />
              <span />
              <span />
            </span>
            <div className="base">
              <span />
              <div className="face" />
            </div>
          </div>
          <div className="longfazers">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RocketLoader;

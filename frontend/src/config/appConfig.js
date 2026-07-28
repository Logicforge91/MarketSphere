export const appConfig = {
  currentVersion: "1.0.0",
  minimumVersion: "1.0.0",
  maintenance: {
    enabled: false,
    message: "MarketSphere is receiving a scheduled upgrade. Please check back shortly.",
    retryAfterMinutes: 30,
  },
  updateUrl: window.location.href,
};

export function compareVersions(left, right) {
  const normalize = (value) => value.split(".").map((part) => Number.parseInt(part, 10) || 0);
  const a = normalize(left);
  const b = normalize(right);
  const length = Math.max(a.length, b.length);

  for (let index = 0; index < length; index += 1) {
    const difference = (a[index] || 0) - (b[index] || 0);
    if (difference !== 0) return Math.sign(difference);
  }
  return 0;
}

export async function checkApplicationStatus() {
  // Replace this resolved policy with a remote config request when the API is available.
  await new Promise((resolve) => window.setTimeout(resolve, 350));
  return {
    forceUpdate: compareVersions(appConfig.currentVersion, appConfig.minimumVersion) < 0,
    maintenance: appConfig.maintenance,
    minimumVersion: appConfig.minimumVersion,
  };
}

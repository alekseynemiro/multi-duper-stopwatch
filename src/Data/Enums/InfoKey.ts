export enum InfoKey {
  /**
   * The unique identifier for the instance.
   */
  UniqueIdentifier = 0,
  /**
   * The version number of the file specification.
   */
  FileSpecificationVersion = 1,
  /**
   * The number of program launches.
   */
  LaunchesCount = 2,
  /**
   * Duration of active use the program.
   */
  TotalUsageTime = 3,
  /**
   * Display name of the client application when creating the profile.
   */
  InitClientName = 100,
  /**
   * The version number of the client application when creating the file.
   */
  InitClientVersion = 101,
  /**
   * Runtime (dotnet) version when creating the file.
   */
  InitRuntimeVersion = 103,
  /**
   * Operating System ID when creating the file.
   */
  InitOperatingSystemId = 104,
  /**
   * Operating System Version when creating the file.
   */
  InitOperatingSystemVersion = 105,
  /**
   * Profile creation date.
   */
  InitDate = 106,
  /**
   * Display name of the client application of the last launch.
   */
  LastClientName = 200,
  /**
   * The version number of the client application of the last launch.
   */
  LastClientVersion = 201,
  /**
   * Runtime (dotnet) version of the last login.
   */
  LastRuntimeVersion = 203,
  /**
   * Operating System ID at last launch.
   */
  LastOperatingSystemId = 204,
  /**
   * Operating System Version at the last launch.
   */
  LastOperatingSystemVersion = 205,
  /**
   * The date of the last successful launch.
   */
  LastLaunchDate = 206,
}

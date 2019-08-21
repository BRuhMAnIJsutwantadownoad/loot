import {
  LootVersion,
  SimpleMessage,
  DerivedPluginMetadata,
  GetInstalledGamesResponse,
  LootSettings,
  GameData,
  MainContent,
  PluginLoadOrderIndex,
  GameGroups,
  RawGroup,
  PluginMetadata,
  GameContent
} from './interfaces';

interface CefQueryParameters {
  request: string;
  persistent: boolean;
  onSuccess: (response: string) => void;
  onFailure: (errorCode: number, errorMessage: string) => void;
}

declare global {
  interface Window {
    cefQuery: (query: CefQueryParameters) => number;
  }
}

export interface EditorState {
  applyEdits: boolean;
  metadata: PluginMetadata;
}

export interface GetInitErrorsResponse {
  errors: string[];
}

export interface PluginData {
  metadata: DerivedPluginMetadata;
  conflicts: boolean;
}

export interface GetConflictingPluginsResponse {
  generalMessages: SimpleMessage[];
  plugins: PluginData[];
}

export interface GetGameTypesResponse {
  gameTypes: string[];
}

export interface GetAutoSortResponse {
  autoSort: boolean;
}

export interface CancelSortResponse {
  plugins: PluginLoadOrderIndex[];
  generalMessages: SimpleMessage[];
}

export interface ClearAllMetadataResponse {
  plugins: DerivedPluginMetadata[];
}

function query(requestName: string, payload?: object): Promise<string> {
  if (!requestName) {
    throw new Error('No request name passed');
  }

  return new Promise((resolve, reject): void => {
    window.cefQuery({
      request: JSON.stringify(Object.assign({ name: requestName }, payload)),
      persistent: false,
      onSuccess: resolve,
      onFailure: (_errorCode, errorMessage) => {
        reject(new Error(errorMessage));
      }
    });
  });
}

export function getVersion(): Promise<LootVersion> {
  return query('getVersion').then(JSON.parse);
}

export function getInitErrors(): Promise<GetInitErrorsResponse> {
  return query('getInitErrors').then(JSON.parse);
}

export function getConflictingPlugins(
  targetPluginName: string
): Promise<GetConflictingPluginsResponse> {
  return query('getConflictingPlugins', { pluginName: targetPluginName }).then(
    JSON.parse
  );
}

export function getGameTypes(): Promise<GetGameTypesResponse> {
  return query('getGameTypes').then(JSON.parse);
}

export function getInstalledGames(): Promise<GetInstalledGamesResponse> {
  return query('getInstalledGames').then(JSON.parse);
}

export function getSettings(): Promise<LootSettings> {
  return query('getSettings').then(JSON.parse);
}

export function getGameData(): Promise<GameData> {
  return query('getGameData').then(JSON.parse);
}

export function getAutoSort(): Promise<GetAutoSortResponse> {
  return query('getAutoSort').then(JSON.parse);
}

export function changeGame(gameFolder: string): Promise<GameData> {
  return query('changeGame', { gameFolder }).then(JSON.parse);
}

export function updateMasterlist(): Promise<GameData> {
  return query('updateMasterlist').then(JSON.parse);
}

export function sortPlugins(): Promise<MainContent> {
  return query('sortPlugins').then(JSON.parse);
}

export function cancelSort(): Promise<CancelSortResponse> {
  return query('cancelSort').then(JSON.parse);
}

export function clearPluginMetadata(
  pluginName: string
): Promise<DerivedPluginMetadata> {
  return query('clearPluginMetadata', { pluginName }).then(JSON.parse);
}

export function clearAllMetadata(): Promise<ClearAllMetadataResponse> {
  return query('clearAllMetadata').then(JSON.parse);
}

export function closeSettings(
  settings: LootSettings
): Promise<GetInstalledGamesResponse> {
  return query('closeSettings', { settings }).then(JSON.parse);
}

export function saveUserGroups(userGroups: RawGroup[]): Promise<GameGroups> {
  return query('saveUserGroups', { userGroups }).then(JSON.parse);
}

export function editorClosed(
  editorState: EditorState
): Promise<DerivedPluginMetadata> {
  return query('editorClosed', { editorState }).then(JSON.parse);
}

export function editorOpened(): Promise<void> {
  return query('editorOpened').then(() => {});
}

export function saveFilterState(name: string, state: boolean): Promise<void> {
  return query('saveFilterState', { filter: { name, state } }).then(() => {});
}

export function discardUnappliedChanges(): Promise<void> {
  return query('discardUnappliedChanges').then(() => {});
}

export function applySort(pluginNames: string[]): Promise<void> {
  return query('applySort', { pluginNames }).then(() => {});
}

export function redatePlugins(): Promise<void> {
  return query('redatePlugins').then(() => {});
}

export function copyContent(content: GameContent): Promise<void> {
  return query('copyContent', { content }).then(() => {});
}

export function copyLoadOrder(pluginNames: string[]): Promise<void> {
  return query('copyLoadOrder', { pluginNames }).then(() => {});
}

export function copyMetadata(pluginName: string): Promise<void> {
  return query('copyMetadata', { pluginName }).then(() => {});
}

export function openReadme(relativeFilePath: string): Promise<void> {
  return query('openReadme', { relativeFilePath }).then(() => {});
}

export function openLogLocation(): Promise<void> {
  return query('openLogLocation').then(() => {});
}

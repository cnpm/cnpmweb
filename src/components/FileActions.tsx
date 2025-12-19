import { CopyOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip, message } from "antd";
import { isEmpty } from "lodash";
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// #region Store
interface IState {
  rawUrl: string;
  fileContent: string;
}

const initialState: IState = {
  rawUrl: '',
  fileContent: '',
};

const setStore = (state: Partial<IState>) =>
  useFileActionsStore.setState(state, false, 'FileActions/setStore')

const restoreStore = () =>
  useFileActionsStore.setState(initialState, false, 'FileActions/restoreStore')

const useFileActionsStore = create<IState>()(
  devtools(() => initialState, { name: 'FileActions' })
);
// #endregion Store

// ===========================================================================

// #region Component
function _FileActions() {
  const state = useFileActionsStore();

  function handleCopyRaw() {
    if (!state.fileContent) return;
    navigator.clipboard.writeText(state.fileContent);
    message.success('Copied to clipboard');
  }

  function handleDownloadRaw() {
    if (!state.fileContent) return;
    const blob = new Blob([state.fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = state.rawUrl.split('/').pop() || 'file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  function handleViewRaw() {
    if (!state.rawUrl) return;
    window.open(state.rawUrl, '_blank', 'noopener,noreferrer');
  }

  // ========== render =========
  if (Object.values(state).some(isEmpty)) return null

  return (
    <Space.Compact block>
      <Button size="small" onClick={handleViewRaw}>Raw</Button>
      <Tooltip title="Copy raw file">
        <Button size="small" icon={<CopyOutlined />} onClick={handleCopyRaw} />
      </Tooltip>
      <Tooltip title="Download raw file">
        <Button size="small" icon={<DownloadOutlined />} onClick={handleDownloadRaw} />
      </Tooltip>
    </Space.Compact>
  )
}

export const FileActions = Object.assign(_FileActions, {
  setStore,
  restoreStore,
});
// #endregion Component
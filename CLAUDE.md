@AGENTS.md

<!--
这个文件故意写成普通文本文件，而不是指向 AGENTS.md 的符号链接。

原因：符号链接在 Windows / WSL 的 /mnt 挂载（9p 文件系统）上不可靠，
git 读取链接内容时会报 `Function not implemented`，导致 git add 直接失败。
另外 Claude Code 官方文档也明确建议：只要仓库可能被 Windows 用户克隆，
就应该用 `@AGENTS.md` 导入而不是 symlink。

`@AGENTS.md` 是 Claude Code 的原生导入语法，AGENTS.md 保持为唯一内容来源，
两边不会出现内容不一致。
-->

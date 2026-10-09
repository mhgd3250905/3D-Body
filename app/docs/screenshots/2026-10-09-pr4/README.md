# PR #4 实际浏览器与资源验证

固定PR来源 `3b25f13075dcf4aa0bec918cdbf2947c5a8bb8a3`，整合v41保存点 `e27f4cd8ff7b6848de50da2377e76cb00542dabb`，实际合并 `bb94d849099d6a2985aa72c00373ce17d81a9993`。2026-10-09在E盘隔离8854预览，以390×844实际操作并截图，未合成页面或模型。

| 实际截图 | 内容 |
| --- | --- |
| [浅色训练库](light-library.jpg) | 新浅色图实际加载 |
| [浅色详情](light-detail.jpg) | 大图、背景渐变、剂量和要点 |
| [浅色今日训练](light-today.jpg) | 同训练的小图采用浅色 |
| [深色训练库](dark-library.jpg) | 切换主题后恢复原深色图 |
| [深色详情](dark-detail.jpg) | 原深色大图仍可用 |

[resource-check.json](resource-check.json) 保存102张解码、尺寸、ID、字节哈希及缩略对照；[visual-review.json](visual-review.json) 记录51对图像及两项差异的实际审阅；[delivery-check.json](delivery-check.json) 核对APK/Web中全部浅图与v41场景的源字节。截图大小与哈希另见 `manifest.json`。

合并前v41 APK与最终APK均保存在E盘 `output/releases/`。完整测试、构建和范围限制见 [验证记录](../../verification.md)。

---
title: 学习powershell 基本用法
description: 只是为了好玩
pubDate: 2026-10-02
draft: true
aliases:
  - pwsh
---

```powershell
Get-Disk | Select-Object Number,FriendlyName,PartitionStyle,@{n='SizeGB';e={[math]::Round($_.Size/1GB,1)}} | Format-Table -AutoSize
Get-Partition | Select-Object DiskNumber,PartitionNumber,DriveLetter,Type,@{n='SizeGB';e={[math]::Round($_.Size/1GB,1)}} | Format-Table -AutoSize
Get-Volume | Select-Object DriveLetter,FileSystemLabel,FileSystem,@{n='SizeGB';e={[math]::Round($_.Size/1GB,1)}},@{n='FreeGB';e={[math]::Round($_.SizeRemaining/1GB,1)}} | Format-Table -AutoSize
"firmware_type=$env:firmware_type"
try { "SecureBoot=" + (Confirm-SecureBootUEFI) } catch { "SecureBoot=非UEFI或无法读取" }
Get-BitLockerVolume | Select-Object MountPoint,VolumeStatus,ProtectionStatus,EncryptionPercentage | Format-Table -AutoSize
powercfg /a
Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model,@{n='RAMGB';e={[math]::Round($_.TotalPhysicalMemory/1GB,1)}} | Format-List
Get-CimInstance Win32_BIOS | Select-Object Manufacturer,Name,SMBIOSBIOSVersion,ReleaseDate | Format-List
Get-CimInstance Win32_VideoController | Select-Object Name | Format-Table -AutoSize
Get-NetAdapter | Select-Object Name,InterfaceDescription,Status | Format-Table -AutoSize
```

## 测试TCP连接
`Test-NetConnection github.com -Port 443`
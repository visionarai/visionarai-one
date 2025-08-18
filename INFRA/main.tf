terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.40.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = "2a3fc773-3514-41e9-b534-8c5b7f1ec250"
}

variable "prefix" {
  default = "visionarai-one"
}

resource "azurerm_resource_group" "visionarai_one" {
  name     = "${var.prefix}-resources"
  location = "West Europe"
  tags = {
    project     = "visionarai"
    environment = "${var.prefix}"
  }
}

resource "azurerm_virtual_network" "visionarai_one" {
  name                = "${var.prefix}-network"
  address_space       = ["20.20.0.0/16"]
  location            = azurerm_resource_group.visionarai_one.location
  resource_group_name = azurerm_resource_group.visionarai_one.name
  tags = {
    project     = "visionarai"
    environment = "${var.prefix}-dev"
  }
}

resource "azurerm_subnet" "visionarai_one_subnet_0" {
  name                 = "${var.prefix}-subnet-0"
  resource_group_name  = azurerm_resource_group.visionarai_one.name
  virtual_network_name = azurerm_virtual_network.visionarai_one.name
  address_prefixes     = ["20.20.1.0/24"]
}

resource "azurerm_network_security_group" "visionarai_one_ssh_security_group" {
  name                = "${var.prefix}-ssh"
  location            = azurerm_resource_group.visionarai_one.location
  resource_group_name = azurerm_resource_group.visionarai_one.name

  tags = {
    project     = "visionarai"
    environment = "${var.prefix}-dev"
  }

  security_rule {
    name                       = "AllowSSH"
    priority                   = 1000
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_ranges    = ["22"]
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_public_ip" "visionarai_one_zero_vm_public_ip" {
  name                = "${var.prefix}-zero-vm-public-ip"
  location            = azurerm_resource_group.visionarai_one.location
  resource_group_name = azurerm_resource_group.visionarai_one.name
  allocation_method   = "Static"

  tags = {
    project     = "visionarai"
    environment = "${var.prefix}-dev"
    vm          = "Zero VM"
  }
}

resource "azurerm_network_interface" "visionarai_one_zero_vm_nic" {
  name                = "${var.prefix}-zero-vm-nic"
  location            = azurerm_resource_group.visionarai_one.location
  resource_group_name = azurerm_resource_group.visionarai_one.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.visionarai_one_subnet_0.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.visionarai_one_zero_vm_public_ip.id
  }

  tags = {
    project     = "visionarai"
    environment = "${var.prefix}-dev"
    vm          = "Zero VM"
  }
}

resource "azurerm_network_interface_security_group_association" "visionarai_one_zero_vm_nic_sg" {
  network_interface_id      = azurerm_network_interface.visionarai_one_zero_vm_nic.id
  network_security_group_id = azurerm_network_security_group.visionarai_one_ssh_security_group.id
}

resource "azurerm_linux_virtual_machine" "visionarai_one_zero_vm" {
  name                = "${var.prefix}-zero-vm"
  location            = azurerm_resource_group.visionarai_one.location
  resource_group_name = azurerm_resource_group.visionarai_one.name
  size                = "Standard_DS1_v2"
  admin_username      = "adminuser"

  network_interface_ids = [
    azurerm_network_interface.visionarai_one_zero_vm_nic.id,
  ]

  admin_ssh_key {
    username   = "adminuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  os_disk {
    name                 = "${var.prefix}-zero-vm-osdisk"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
    disk_size_gb         = 30
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

  tags = {
    project     = "visionarai"
    environment = "${var.prefix}-dev"
    vm          = "Zero VM"
  }
}

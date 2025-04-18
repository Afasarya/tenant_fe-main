<template>
  <li class="back-btn">
    <router-link to="/">
      <img class="img-fluid" src="@/assets/images/logo/logo_icon.png" alt="" />
    </router-link>
    <div class="mobile-back text-end">
      <span>Back</span><i class="fa fa-angle-right ps-2" aria-hidden="true"></i>
    </div>
  </li>
  <li
    v-for="(menuItem, index) in menu"
    :key="index"
    class="sidebar-list"
    :class="[
      { ' sidebar-main-title': menuItem.type == 'headtitle' },
      menuItem.isPinned ? 'pined' : '',
    ]"
  >
    <div v-if="menuItem.type == 'headtitle'">
      <h6 class="lan-1">{{ menuItem.headTitle1 ?? "" }}</h6>
    </div>
    <a
      href="javascript:void(0)"
      class="sidebar-link sidebar-title"
      v-if="menuItem.type == 'sub'"
      :class="menuItem.title == store.perentName ? 'active' : ''"
      @click="store.subMenuToggle(menuItem.title ?? '')"
    >
      <svg class="stroke-icon">
        <use
          :xlink:href="
            require('@/assets/svg/icon-sprite.svg') + `#${menuItem.icon}`
          "
        ></use>
      </svg>
      <svg class="fill-icon">
        <use
          :xlink:href="
            require('@/assets/svg/icon-sprite.svg') + `#${menuItem.icon1}`
          "
        ></use>
      </svg>
      <span class="lan-6">
        {{ menuItem.title ?? "" }}
      </span>
      <div class="according-menu" v-if="menuItem.children">
        <i
          class="pull-right"
          :class="[
            menuItem.title == store.perentName
              ? 'fa fa-angle-down'
              : 'fa fa-angle-right',
          ]"
        ></i>
      </div>
    </a>
    <router-link
      :to="menuItem.path ?? ''"
      class="sidebar-link sidebar-title"
      v-if="menuItem.type == 'link'"
      :class="menuItem.title == store.perentName ? 'active' : ''"
      @click="store.subMenuToggle(menuItem.title ?? '')"
    >
      <svg class="stroke-icon">
        <use
          :xlink:href="
            require('@/assets/svg/icon-sprite.svg') + `#${menuItem.icon}`
          "
        ></use>
      </svg>
      <svg class="fill-icon">
        <use
          :xlink:href="
            require('@/assets/svg/icon-sprite.svg') + `#${menuItem.icon1}`
          "
        ></use>
      </svg>
      <span>
        {{ menuItem.title ?? "" }}
      </span>
      <i class="fa fa-angle-right pull-right" v-if="menuItem.children"></i>
    </router-link>
    <a
      :href="menuItem.path"
      class="sidebar-link sidebar-title"
      v-if="menuItem.type == 'extLink'"
    >
      <svg class="stroke-icon">
        <use
          :xlink:href="
            require('@/assets/svg/icon-sprite.svg') + `#${menuItem.icon}`
          "
        ></use>
      </svg>
      <svg class="fill-icon">
        <use
          :xlink:href="
            require('@/assets/svg/icon-sprite.svg') + `#${menuItem.icon1}`
          "
        ></use>
      </svg>
      <span>
        {{ menuItem.title ?? "" }}
      </span>
      <i class="fa fa-angle-right pull-right" v-if="menuItem.children"></i>
    </a>
    <a
      :href="menuItem.path"
      target="_blank"
      class="sidebar-link sidebar-title"
      v-if="menuItem.type == 'extTabLink'"
    >
      <svg class="stroke-icon">
        <use
          :xlink:href="
            require('@/assets/svg/icon-sprite.svg') + `#${menuItem.icon}`
          "
        ></use>
      </svg>
      <svg class="fill-icon">
        <use
          :xlink:href="
            require('@/assets/svg/icon-sprite.svg') + `#${menuItem.icon1}`
          "
        ></use>
      </svg>
      <span>
        {{ menuItem.title ?? "" }}
      </span>
      <i class="fa fa-angle-right pull-right" v-if="menuItem.children"></i>
    </a>
    <ul
      class="sidebar-submenu"
      v-if="menuItem.children"
      :style="
        menuItem.title == store.perentName ? 'display:block' : 'display:none'
      "
    >
      <li v-for="(childrenItem, index) in menuItem.children" :key="index">
        <a
          class="lan-4"
          :class="{ active: childrenItem.active }"
          href="javascript:void(0)"
          v-if="childrenItem.type == 'sub'"
          @click="store.subChildMenu(childrenItem.title ?? '')"
        >
          {{ childrenItem.title ?? "" }}
          <label
            :class="'badge badge-' + childrenItem.badgeType + ' pull-right'"
            v-if="childrenItem.badgeType"
          >
            {{ childrenItem?.badgeValue ?? "" }}
          </label>
          <i
            class="fa pull-right"
            v-bind:class="[
              childrenItem.title == store.subName
                ? 'fa fa-angle-down'
                : 'fa fa-angle-right',
            ]"
            v-if="childrenItem.children"
          ></i>
        </a>
        <router-link
          class="lan-4"
          :class="{ active: childrenItem.active }"
          :to="childrenItem.path ?? ''"
          v-if="childrenItem.type == 'link'"
        >
          {{ childrenItem.title ?? "" }}
          <label
            :class="'badge badge-' + childrenItem.badgeType + ' pull-right'"
            v-if="childrenItem.badgeType"
            >{{ childrenItem.badgeValue }}</label
          >
          <i
            class="fa fa-angle-right pull-right mt-1"
            v-if="childrenItem.children"
          ></i>
        </router-link>
        <ul
          class="nav-sub-childmenu submenu-content"
          v-if="childrenItem.children"
          :class="childrenItem.title == store.subName ? 'opensubchild' : ''"
        >
          <li
            v-for="(childrenSubItem, index) in childrenItem.children"
            :key="index"
          >
            <router-link
              :class="{ active: childrenSubItem.active }"
              :to="childrenSubItem.path ?? ''"
              v-if="childrenSubItem.type == 'link'"
            >
              {{ childrenSubItem.title ?? "" }}
              <label
                :class="
                  'badge badge-' + childrenSubItem.badgeType + ' pull-right'
                "
                v-if="childrenSubItem.badgeType"
                >{{ childrenSubItem.badgeValue }}</label
              >
              <i
                class="fa fa-angle-right pull-right"
                v-if="childrenSubItem.children"
              ></i>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</template>
<script lang="ts" setup>
import { useMenuStore } from "@/store/menu";

let store = useMenuStore();
let menu = store.data;
</script>

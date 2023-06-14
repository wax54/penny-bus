import { Blog } from '../types'
import blog from './blog'
export default {
  blog 
} as {
  blog: {[slug: string]: Blog}
}
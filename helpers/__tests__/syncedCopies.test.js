/* global describe, expect, test */
import colors from 'chalk'
import * as sc from '../syncedCopies'

const FILE = `helpers/syncedCopies`
const section = colors.blue

describe(`${FILE}`, () => {
  describe(section('textWithoutSyncedCopyTag'), () => {
    test('should remove sync copy tag by itself ^x29vcq', () => {
      expect(sc.textWithoutSyncedCopyTag(' ^x29vcq')).toEqual('')
    })
    test('beginning of line also works with no space', () => {
      expect(sc.textWithoutSyncedCopyTag('^x29vcq')).toEqual('')
    })
    test('should remove sync copy tag and leave text', () => {
      expect(sc.textWithoutSyncedCopyTag('a ^x29vcq')).toEqual('a')
    })
    test('should not remove anything if tag does not match regex', () => {
      expect(sc.textWithoutSyncedCopyTag('a ^x29vc')).toEqual('a ^x29vc')
    })
    test('should remove anything if tag is in middle of line', () => {
      expect(sc.textWithoutSyncedCopyTag('a ^x29vcq xx')).toEqual('a xx')
    })
  })

  // TODO: need to add tests for: getSyncedCopiesAsList
  describe('getSyncedCopiesAsList', () => {
    test('should ', () => {})
  })

  describe('eliminateDuplicateSyncedParagraphs', () => {
    describe('with default returns first item in list', () => {
      test('should not eliminate paragraphs if no duplicate', () => {
        const before = [{ content: 'foo' }, { content: 'bar' }]
        expect(sc.eliminateDuplicateSyncedParagraphs(before)).toEqual(before)
      })
      test('should eliminate paragraphs if duplicate', () => {
        const before = [{ content: 'foo' }, { content: 'foo' }]
        expect(sc.eliminateDuplicateSyncedParagraphs(before).length).toEqual(1)
      })
      test('should eliminate paragraphs if duplicate in mixed bag', () => {
        const before = [{ content: 'foo' }, { content: 'bar' }, { content: 'foo' }]
        expect(sc.eliminateDuplicateSyncedParagraphs(before)).toEqual([{ content: 'foo' }, { content: 'bar' }])
      })
      test('should eliminate paragraphs content is the same but its the same block reference from the same file', () => {
        const before = [
          { content: 'foo', filename: 'a', blockId: '^b' },
          { content: 'foo', filename: 'a', blockId: '^b' },
        ]
        expect(sc.eliminateDuplicateSyncedParagraphs(before).length).toEqual(1)
      })
      test('should allow apparently duplicate content if blockID is different', () => {
        const before = [
          { content: 'foo', filename: 'a', blockId: '^h' },
          { content: 'foo', filename: 'b', blockId: '^j' },
        ]
        expect(sc.eliminateDuplicateSyncedParagraphs(before)).toEqual(before)
      })
      test('should allow apparently duplicate content if blockID is undefined in both but filename is different', () => {
        const before = [
          { content: 'foo', filename: 'a' },
          { content: 'foo', filename: 'b' },
        ]
        expect(sc.eliminateDuplicateSyncedParagraphs(before)).toEqual(before)
      })
      test('should not allow apparently duplicate content if blockID is same and file is different', () => {
        const before = [
          { content: 'foo', filename: 'a', blockId: '^h' },
          { content: 'foo', filename: 'b', blockId: '^h' },
        ]
        expect(sc.eliminateDuplicateSyncedParagraphs(before).length).toEqual(1)
      })
    })

    describe('returning most recently changed date item in list', () => {
      test('should return just the sync copy from file2', () => {
        const before = [
          { content: 'foo', filename: 'file1', blockId: '^b', note: { changedDate: new Date(2022, 5, 6, 6, 6, 6) } },
          { content: 'foo', filename: 'file2', blockId: '^b', note: { changedDate: new Date(2023, 0, 1, 1, 1, 1) } },
        ]
        expect(sc.eliminateDuplicateSyncedParagraphs([...before], 'most-recent')).toEqual([before[1]])
      })
      test('should return just the sync copy from file3', () => {
        const before = [
          { content: 'foo', filename: 'file1', blockId: '^b', note: { changedDate: new Date(2022, 5, 6, 6, 6, 6) } },
          { content: 'foo', filename: 'file2', blockId: '^b', note: { changedDate: new Date(2022, 8, 9, 9, 9, 9) } },
          { content: 'foo', filename: 'file3', blockId: '^b', note: { changedDate: new Date(2023, 0, 1, 1, 1, 1) } },
        ]
        expect(sc.eliminateDuplicateSyncedParagraphs([...before], 'most-recent')).toEqual([before[2]])
      })
    })
  })
})
